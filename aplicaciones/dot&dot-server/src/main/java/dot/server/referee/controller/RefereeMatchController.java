package dot.server.referee.controller;

import dot.server.data.Club.dao.TeamDao;
import dot.server.data.Club.entity.Team;
import dot.server.data.Definitions.SanctionType;
import dot.server.data.Match.model.Game;
import dot.server.data.Match.model.GameSanctions;
import dot.server.data.Match.model.GameSet;
import dot.server.data.Match.model.GameResult;
import dot.server.data.Match.model.dto.GameDto;
import dot.server.data.Match.repository.GameRepository;
import dot.server.data.Match.repository.GameResultRepository;
import dot.server.data.Match.repository.GameSanctionsRepository;
import dot.server.data.Match.repository.GameSetRepository;
import dot.server.websocket.service.LiveGameBroadcastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/referee/matches")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_REFEREE')")
public class RefereeMatchController {

    private final GameRepository gameRepository;
    private final GameSetRepository gameSetRepository;
    private final GameSanctionsRepository gameSanctionsRepository;
    private final GameResultRepository gameResultRepository;
    private final TeamDao teamRepository;
    private final LiveGameBroadcastService broadcastService;

    /**
     * Get game by unique code
     * GET /referee/matches/{uniqueCode}
     */
    @GetMapping("/{uniqueCode}")
    public ResponseEntity<?> getGame(@PathVariable String uniqueCode) {
        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        GameDto gameDto = new GameDto().to(gameOpt.get());
        return ResponseEntity.ok(gameDto);
    }

    /**
     * Start a game
     * PUT /referee/matches/{uniqueCode}/start
     */
    @PutMapping("/{uniqueCode}/start")
    public ResponseEntity<?> startGame(@PathVariable String uniqueCode) {
        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();

        if (game.isPlaying()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is already in progress"));
        }

        if (game.isFinished()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is already finished"));
        }

        game.setPlaying(true);
        
        
        GameSet firstSet = new GameSet();
        firstSet.setUniqueCode(game.getUniqueCode());
        firstSet.setSetNumber(1);
        firstSet.setPointsLocal(0);
        firstSet.setPointsVisit(0);
        firstSet.setTimeStart(new Timestamp(System.currentTimeMillis()));
        gameSetRepository.save(firstSet);

        gameRepository.save(game);

        
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        GameDto gameDto = new GameDto().to(updatedGame);

        
        broadcastService.broadcastGameUpdate(uniqueCode, updatedGame, "STARTED");

        return ResponseEntity.ok(gameDto);
    }

    @PostMapping("/{uniqueCode}/sets/{setId}/points")
    public ResponseEntity<?> updateSetPoints(
            @PathVariable String uniqueCode,
            @PathVariable Long setId,
            @RequestBody Map<String, Object> body) {

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();

        if (!game.isPlaying()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is not currently playing"));
        }

        Optional<GameSet> setOpt = gameSetRepository.findById(setId);
        if (setOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "GameSet not found with id: " + setId));
        }

        GameSet set = setOpt.get();

        if (!set.getUniqueCode().equals(uniqueCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Set does not belong to this game"));
        }

        String team = (String) body.get("team");
        Integer points = (Integer) body.get("points");

        if (team == null || points == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Missing required fields: team and points"));
        }

        if (!team.equals("local") && !team.equals("visit")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Team must be 'local' or 'visit'"));
        }

        if (team.equals("local")) {
            set.setPointsLocal(set.getPointsLocal() + points);
        } else {
            set.setPointsVisit(set.getPointsVisit() + points);
        }

        gameSetRepository.save(set);

        
        if (shouldEndSet(set)) {
            set.setTimeEnd(new Timestamp(System.currentTimeMillis()));
            gameSetRepository.save(set);

            
            if (shouldEndGame(game)) {
                finishGameWithResult(game);
            }
        }

        
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        GameDto gameDto = new GameDto().to(updatedGame);

        
        broadcastService.broadcastGameUpdate(uniqueCode, updatedGame, "POINTS");

        return ResponseEntity.ok(gameDto);
    }

    @PostMapping("/{uniqueCode}/sanctions")
    public ResponseEntity<?> addSanction(
            @PathVariable String uniqueCode,
            @RequestBody Map<String, Object> body) {

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();

        if (!game.isPlaying()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is not currently playing"));
        }

        String typeStr = (String) body.get("type");
        Integer teamId = (Integer) body.get("teamId");
        String marcador = (String) body.get("marcador");
        String sanctionTypeStr = (String) body.get("sanctionType"); 

        if (typeStr == null || teamId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Missing required fields: type and teamId"));
        }

        String severity;
        SanctionType sanctionType;
        
        
        if (typeStr.equalsIgnoreCase("YELLOW") || typeStr.equalsIgnoreCase("RED")) {
            severity = typeStr.toUpperCase();
            
            
            if (sanctionTypeStr != null && !sanctionTypeStr.isEmpty()) {
                try {
                    sanctionType = SanctionType.valueOf(sanctionTypeStr.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Invalid sanctionType: " + sanctionTypeStr));
                }
            } else {
                sanctionType = SanctionType.INDIVIDUAL; 
            }
        } else {
            
            try {
                sanctionType = SanctionType.valueOf(typeStr.toUpperCase());
                severity = "YELLOW"; 
            } catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid sanction type. Must be YELLOW, RED, or valid sanction type (INDIVIDUAL, COACH, ASSISTANT_COACH, SUPPORT, IMPROPER, DELAY)"));
            }
        }

        Optional<Team> teamOpt = teamRepository.findById(teamId.longValue());
        if (teamOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Team not found with id: " + teamId));
        }

        GameSanctions sanction = new GameSanctions();
        sanction.setGame(game);
        sanction.setType(sanctionType);
        sanction.setSeverity(severity);
        sanction.setTeam(teamOpt.get());
        sanction.setMarcador(marcador != null ? marcador.substring(0, Math.min(marcador.length(), 5)) : null);

        gameSanctionsRepository.save(sanction);

        
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        GameDto gameDto = new GameDto().to(updatedGame);

        
        broadcastService.broadcastGameUpdate(uniqueCode, updatedGame, "SANCTION");

        return ResponseEntity.ok(gameDto);
    }

    /**
     * Delete a sanction (remove incorrect card)
     * DELETE /referee/matches/{uniqueCode}/sanctions/{sanctionId}
     */
    @DeleteMapping("/{uniqueCode}/sanctions/{sanctionId}")
    public ResponseEntity<?> deleteSanction(
            @PathVariable String uniqueCode,
            @PathVariable Long sanctionId) {

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();

        if (!game.isPlaying()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is not currently playing"));
        }

        Optional<GameSanctions> sanctionOpt = gameSanctionsRepository.findById(sanctionId);
        if (sanctionOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Sanction not found with id: " + sanctionId));
        }

        GameSanctions sanction = sanctionOpt.get();

        if (!sanction.getGame().getUniqueCode().equals(uniqueCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Sanction does not belong to the specified game"));
        }

        gameSanctionsRepository.delete(sanction);

        
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        GameDto gameDto = new GameDto().to(updatedGame);

        return ResponseEntity.ok(gameDto);
    }

    @PutMapping("/{uniqueCode}/sets/{setId}/alignments")
    public ResponseEntity<?> updateAlignments(
            @PathVariable String uniqueCode,
            @PathVariable Long setId,
            @RequestBody Map<String, String> body) {

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();

        if (!game.isPlaying()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is not currently playing"));
        }

        Optional<GameSet> setOpt = gameSetRepository.findById(setId);
        if (setOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "GameSet not found with id: " + setId));
        }

        GameSet gameSet = setOpt.get();

        if (!gameSet.getUniqueCode().equals(uniqueCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "GameSet does not belong to the specified game"));
        }

        String localAlignment = body.get("localAlignment");
        String visitAlignment = body.get("visitAlignment");

        if (localAlignment != null) {
            gameSet.setLocalAlignment(localAlignment.substring(0, Math.min(localAlignment.length(), 20)));
        }

        if (visitAlignment != null) {
            gameSet.setVisitAlignment(visitAlignment.substring(0, Math.min(visitAlignment.length(), 20)));
        }

        gameSetRepository.save(gameSet);

        
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        GameDto gameDto = new GameDto().to(updatedGame);

        return ResponseEntity.ok(gameDto);
    }

    /**
     * Record a substitution (update alignment mid-game)
     * POST /referee/matches/{uniqueCode}/substitutions
     * Body: { "setId": 1, "team": "local" | "visit", "newAlignment": "1-2-3-4-5-6" }
     */
    @PostMapping("/{uniqueCode}/substitutions")
    public ResponseEntity<?> recordSubstitution(
            @PathVariable String uniqueCode,
            @RequestBody Map<String, Object> body) {

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();

        if (!game.isPlaying()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is not currently playing"));
        }

        Integer setIdInt = (Integer) body.get("setId");
        String team = (String) body.get("team");
        String newAlignment = (String) body.get("newAlignment");

        if (setIdInt == null || team == null || newAlignment == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Missing required fields: setId, team, and newAlignment"));
        }

        if (!team.equals("local") && !team.equals("visit")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Team must be 'local' or 'visit'"));
        }

        Optional<GameSet> setOpt = gameSetRepository.findById(setIdInt.longValue());
        if (setOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "GameSet not found with id: " + setIdInt));
        }

        GameSet gameSet = setOpt.get();

        if (!gameSet.getUniqueCode().equals(uniqueCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "GameSet does not belong to the specified game"));
        }

        String trimmedAlignment = newAlignment.substring(0, Math.min(newAlignment.length(), 20));

        if (team.equals("local")) {
            gameSet.setLocalAlignment(trimmedAlignment);
        } else {
            gameSet.setVisitAlignment(trimmedAlignment);
        }

        gameSetRepository.save(gameSet);

        
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        GameDto gameDto = new GameDto().to(updatedGame);

        return ResponseEntity.ok(gameDto);
    }
    
    @PostMapping("/{uniqueCode}/sets")
    public ResponseEntity<?> startNewSet(
            @PathVariable String uniqueCode,
            @RequestBody Map<String, String> body) {

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();

        if (!game.isPlaying()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is not currently playing"));
        }

        String localAlignment = body.get("localAlignment");
        String visitAlignment = body.get("visitAlignment");

        GameSet newSet = new GameSet();
        newSet.setUniqueCode(game.getUniqueCode());
        newSet.setPointsLocal(0);
        newSet.setPointsVisit(0);
        newSet.setTimeStart(new Timestamp(System.currentTimeMillis()));

        if (localAlignment != null) {
            newSet.setLocalAlignment(localAlignment.substring(0, Math.min(localAlignment.length(), 20)));
        }

        if (visitAlignment != null) {
            newSet.setVisitAlignment(visitAlignment.substring(0, Math.min(visitAlignment.length(), 20)));
        }

        gameSetRepository.save(newSet);

        
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        GameDto gameDto = new GameDto().to(updatedGame);

        return ResponseEntity.ok(gameDto);
    }

    @PutMapping("/{uniqueCode}/sets/{setId}/end")
    public ResponseEntity<?> endSet(
            @PathVariable String uniqueCode,
            @PathVariable Long setId) {

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();

        if (!game.isPlaying()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is not currently playing"));
        }

        Optional<GameSet> setOpt = gameSetRepository.findById(setId);
        if (setOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "GameSet not found with id: " + setId));
        }

        GameSet gameSet = setOpt.get();

        if (!gameSet.getUniqueCode().equals(uniqueCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "GameSet does not belong to the specified game"));
        }

        gameSet.setTimeEnd(new Timestamp(System.currentTimeMillis()));
        gameSetRepository.save(gameSet);

        
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        GameDto gameDto = new GameDto().to(updatedGame);

        return ResponseEntity.ok(gameDto);
    }

    /**
     * Finish the game
     * PUT /referee/matches/{uniqueCode}/finish
     */
    @PutMapping("/{uniqueCode}/finish")
    public ResponseEntity<?> finishGame(@PathVariable String uniqueCode) {

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();

        if (!game.isPlaying()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Game is not currently playing"));
        }

        finishGameWithResult(game);

        
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        GameDto gameDto = new GameDto().to(updatedGame);

        
        broadcastService.broadcastGameUpdate(uniqueCode, updatedGame, "FINISHED");

        return ResponseEntity.ok(gameDto);
    }

    /**
     * Check if a set should end based on volleyball rules:
     * - At least 25 points
     * - If tied at 24-24 or higher, must have 2 point difference
     */
    private boolean shouldEndSet(GameSet gameSet) {
        int local = gameSet.getPointsLocal();
        int visit = gameSet.getPointsVisit();
        
        
        if (gameSet.getTimeEnd() != null) {
            return false;
        }
        
        
        if (local >= 25 && local - visit >= 2) {
            return true;
        }
        if (visit >= 25 && visit - local >= 2) {
            return true;
        }
        
        return false;
    }

    /**
     * Check if a game should end (one team won 3 sets)
     */
    private boolean shouldEndGame(Game game) {
        int localSetsWon = 0;
        int visitSetsWon = 0;
        
        
        GameSet[] sets = {game.getSet1(), game.getSet2(), game.getSet3(), game.getSet4(), game.getSet5()};
        for (GameSet set : sets) {
            if (set != null && set.getTimeEnd() != null) {
                if (set.getPointsLocal() > set.getPointsVisit()) {
                    localSetsWon++;
                } else if (set.getPointsVisit() > set.getPointsLocal()) {
                    visitSetsWon++;
                }
            }
        }
        
        return localSetsWon >= 3 || visitSetsWon >= 3;
    }

    /**
     * Finish the game and create/update the result
     */
    private void finishGameWithResult(Game game) {
        game.setPlaying(false);
        game.setFinished(true);
        
        
        int localSetsWon = 0;
        int visitSetsWon = 0;
        int totalPointsLocal = 0;
        int totalPointsVisit = 0;
        
        GameSet[] sets = {game.getSet1(), game.getSet2(), game.getSet3(), game.getSet4(), game.getSet5()};
        for (GameSet set : sets) {
            if (set != null && set.getTimeEnd() != null) {
                totalPointsLocal += set.getPointsLocal();
                totalPointsVisit += set.getPointsVisit();
                
                if (set.getPointsLocal() > set.getPointsVisit()) {
                    localSetsWon++;
                } else if (set.getPointsVisit() > set.getPointsLocal()) {
                    visitSetsWon++;
                }
            }
        }
        
        gameRepository.save(game);
        
        
        GameResult result = game.getResult();
        if (result == null) {
            result = new GameResult();
            result.setGame(game);
            
            
            if (game.getSet1() != null && game.getSet1().getTimeStart() != null) {
                result.setTimeStart(game.getSet1().getTimeStart());
            } else {
                result.setTimeStart(new java.util.Date());
            }
        }
        
        result.setSetsWonLocal(localSetsWon);
        result.setSetsWonVisit(visitSetsWon);
        result.setPointsLocal(totalPointsLocal);
        result.setPointsVisit(totalPointsVisit);
        result.setTimeEnd(new java.util.Date());
        
        
        if (result.getTimeStart() != null) {
            long durationMs = result.getTimeEnd().getTime() - result.getTimeStart().getTime();
            result.setDuration((int) (durationMs / 60000));
        }
        
        
        if (localSetsWon > visitSetsWon && game.getInitialSituation() != null) {
            result.setWinnerTeam(game.getInitialSituation().getLocalTeam());
        } else if (visitSetsWon > localSetsWon && game.getInitialSituation() != null) {
            result.setWinnerTeam(game.getInitialSituation().getVisitTeam());
        }
        
        gameResultRepository.save(result);
    }
}
