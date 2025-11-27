package dot.server.referee.controller;

import dot.server.data.Club.dao.TeamDao;
import dot.server.data.Club.entity.Team;
import dot.server.data.Definitions.SanctionType;
import dot.server.data.Match.model.Game;
import dot.server.data.Match.model.GameSanctions;
import dot.server.data.Match.model.GameSet;
import dot.server.data.Match.model.GameResult;
import dot.server.data.Match.repository.GameRepository;
import dot.server.data.Match.repository.GameResultRepository;
import dot.server.data.Match.repository.GameSanctionsRepository;
import dot.server.data.Match.repository.GameSetRepository;
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

        GameSet gameSet = setOpt.get();

        if (!gameSet.getGame().getUniqueCode().equals(uniqueCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "GameSet does not belong to the specified game"));
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
            gameSet.setPointsLocal(gameSet.getPointsLocal() + points);
        } else {
            gameSet.setPointsVisit(gameSet.getPointsVisit() + points);
        }

        gameSetRepository.save(gameSet);

        // Check if set should end (25 points or 24-24 with 2 point difference)
        if (shouldEndSet(gameSet)) {
            gameSet.setTimeEnd(new Timestamp(System.currentTimeMillis()));
            gameSetRepository.save(gameSet);

            // Check if game should end (3 sets won)
            if (shouldEndGame(game)) {
                finishGameWithResult(game);
            }
        }

        // Reload game with all relationships
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);

        return ResponseEntity.ok(updatedGame);
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

        if (typeStr == null || teamId == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Missing required fields: type and teamId"));
        }

        SanctionType sanctionType;
        try {
            sanctionType = SanctionType.valueOf(typeStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Invalid sanction type. Must be YELLOW or RED"));
        }

        Optional<Team> teamOpt = teamRepository.findById(teamId.longValue());
        if (teamOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Team not found with id: " + teamId));
        }

        GameSanctions sanction = new GameSanctions();
        sanction.setGame(game);
        sanction.setType(sanctionType);
        sanction.setTeam(teamOpt.get());
        sanction.setMarcador(marcador != null ? marcador.substring(0, Math.min(marcador.length(), 5)) : null);

        gameSanctionsRepository.save(sanction);

        // Reload game with all relationships
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);

        return ResponseEntity.ok(updatedGame);
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

        // Reload game with all relationships
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);

        return ResponseEntity.ok(updatedGame);
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

        if (!gameSet.getGame().getUniqueCode().equals(uniqueCode)) {
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

        // Reload game with all relationships
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);

        return ResponseEntity.ok(updatedGame);
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

        if (!gameSet.getGame().getUniqueCode().equals(uniqueCode)) {
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

        // Reload game with all relationships
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);

        return ResponseEntity.ok(updatedGame);
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
        newSet.setGame(game);
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

        // Reload game with all relationships
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);

        return ResponseEntity.ok(updatedGame);
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

        if (!gameSet.getGame().getUniqueCode().equals(uniqueCode)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "GameSet does not belong to the specified game"));
        }

        gameSet.setTimeEnd(new Timestamp(System.currentTimeMillis()));
        gameSetRepository.save(gameSet);

        // Reload game with all relationships
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);

        return ResponseEntity.ok(updatedGame);
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

        // Reload game with all relationships
        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);

        return ResponseEntity.ok(updatedGame);
    }

    /**
     * Check if a set should end based on volleyball rules:
     * - At least 25 points
     * - If tied at 24-24 or higher, must have 2 point difference
     */
    private boolean shouldEndSet(GameSet gameSet) {
        int local = gameSet.getPointsLocal();
        int visit = gameSet.getPointsVisit();
        
        // Check if timeEnd is already set
        if (gameSet.getTimeEnd() != null) {
            return false;
        }
        
        // One team reached 25 and has at least 2 point difference
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
        
        for (GameSet set : game.getSets()) {
            if (set.getTimeEnd() != null) {
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
        
        // Calculate sets won by each team
        int localSetsWon = 0;
        int visitSetsWon = 0;
        
        for (GameSet set : game.getSets()) {
            if (set.getTimeEnd() != null) {
                if (set.getPointsLocal() > set.getPointsVisit()) {
                    localSetsWon++;
                } else if (set.getPointsVisit() > set.getPointsLocal()) {
                    visitSetsWon++;
                }
            }
        }
        
        gameRepository.save(game);
        
        // Create or update GameResult
        GameResult result = game.getResult();
        if (result == null) {
            result = new GameResult();
            result.setGame(game);
            
            // Set timeStart from first set or current time
            if (!game.getSets().isEmpty() && game.getSets().get(0).getTimeStart() != null) {
                result.setTimeStart(game.getSets().get(0).getTimeStart());
            } else {
                result.setTimeStart(new java.util.Date());
            }
        }
        
        result.setPointsLocal(localSetsWon);
        result.setPointsVisit(visitSetsWon);
        result.setTimeEnd(new java.util.Date());
        
        // Calculate duration in minutes
        if (result.getTimeStart() != null) {
            long durationMs = result.getTimeEnd().getTime() - result.getTimeStart().getTime();
            result.setDuration((int) (durationMs / 60000));
        }
        
        // Determine winner
        if (localSetsWon > visitSetsWon && game.getInitialSituation() != null) {
            result.setWinnerTeam(game.getInitialSituation().getLocalTeam());
        } else if (visitSetsWon > localSetsWon && game.getInitialSituation() != null) {
            result.setWinnerTeam(game.getInitialSituation().getVisitTeam());
        }
        
        gameResultRepository.save(result);
    }
}
