package dot.server.websocket.controller;

import dot.server.data.Club.dao.TeamDao;
import dot.server.data.Club.entity.Team;
import dot.server.data.Definitions.SanctionType;
import dot.server.data.Match.model.Game;
import dot.server.data.Match.model.GameSanctions;
import dot.server.data.Match.model.GameSet;
import dot.server.data.Match.repository.GameRepository;
import dot.server.data.Match.repository.GameSanctionsRepository;
import dot.server.data.Match.repository.GameSetRepository;
import dot.server.websocket.dto.GameUpdateMessage;
import dot.server.websocket.dto.GameUpdateRequest;
import dot.server.websocket.service.LiveGameBroadcastService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Optional;

@Controller
@RequiredArgsConstructor
@Slf4j
public class RefereeWebSocketController {

    private final GameRepository gameRepository;
    private final GameSetRepository gameSetRepository;
    private final GameSanctionsRepository gameSanctionsRepository;
    private final TeamDao teamRepository;
    private final LiveGameBroadcastService broadcastService;

    @MessageMapping("/referee/{uniqueCode}/update")
    @SendTo("/topic/game/{uniqueCode}")
    public GameUpdateMessage handleGameUpdate(
            @DestinationVariable String uniqueCode,
            GameUpdateRequest request,
            Principal principal) {

        log.info("WebSocket update received for game {} by {}: {}", 
                uniqueCode, principal != null ? principal.getName() : "unknown", request.getAction());

        try {
            Optional<Game> gameOpt = gameRepository.findAll().stream()
                    .filter(g -> g.getUniqueCode().equals(uniqueCode))
                    .findFirst();

            if (gameOpt.isEmpty()) {
                log.error("Game not found: {}", uniqueCode);
                return new GameUpdateMessage("ERROR", null, "Game not found", null);
            }

            Game game = gameOpt.get();

            if (!game.isPlaying()) {
                log.warn("Attempt to update non-playing game: {}", uniqueCode);
                return new GameUpdateMessage("ERROR", null, "Game is not playing", null);
            }

            String action = request.getAction();
            GameUpdateMessage response;

            switch (action) {
                case "UPDATE_POINTS" -> {
                    response = updatePoints(game, request);
                }
                case "ADD_SANCTION" -> {
                    response = addSanction(game, request);
                }
                default -> {
                    log.warn("Unknown action: {}", action);
                    response = new GameUpdateMessage("ERROR", null, "Unknown action", null);
                }
            }

            return response;

        } catch (Exception e) {
            log.error("Error processing WebSocket update for game {}: {}", uniqueCode, e.getMessage(), e);
            return new GameUpdateMessage("ERROR", null, "Internal error: " + e.getMessage(), null);
        }
    }

    private GameUpdateMessage updatePoints(Game game, GameUpdateRequest request) {
        Long setId = request.getSetId();
        String team = request.getTeam();
        Integer points = request.getPoints();

        if (setId == null || team == null || points == null) {
            return new GameUpdateMessage("ERROR", null, "Missing required fields", null);
        }

        Optional<GameSet> setOpt = gameSetRepository.findById(setId);
        if (setOpt.isEmpty()) {
            return new GameUpdateMessage("ERROR", null, "Set not found", null);
        }

        GameSet set = setOpt.get();

        if (!set.getUniqueCode().equals(game.getUniqueCode())) {
            return new GameUpdateMessage("ERROR", null, "Set does not belong to this game", null);
        }

        if (team.equals("local")) {
            set.setPointsLocal(set.getPointsLocal() + points);
        } else if (team.equals("visit")) {
            set.setPointsVisit(set.getPointsVisit() + points);
        } else {
            return new GameUpdateMessage("ERROR", null, "Invalid team", null);
        }

        gameSetRepository.save(set);

        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        broadcastService.broadcastGameUpdate(game.getUniqueCode(), updatedGame, "POINTS");

        return GameUpdateMessage.pointsUpdate(updatedGame);
    }

    private GameUpdateMessage addSanction(Game game, GameUpdateRequest request) {
        GameUpdateRequest.SanctionData sanctionData = request.getSanction();

        if (sanctionData == null || sanctionData.getType() == null || sanctionData.getTeamId() == null) {
            return new GameUpdateMessage("ERROR", null, "Missing sanction data", null);
        }

        SanctionType sanctionType;
        try {
            sanctionType = SanctionType.valueOf(sanctionData.getType().toUpperCase());
        } catch (IllegalArgumentException e) {
            return new GameUpdateMessage("ERROR", null, "Invalid sanction type", null);
        }

        Optional<Team> teamOpt = teamRepository.findById(sanctionData.getTeamId());
        if (teamOpt.isEmpty()) {
            return new GameUpdateMessage("ERROR", null, "Team not found", null);
        }

        GameSanctions sanction = new GameSanctions();
        sanction.setGame(game);
        sanction.setType(sanctionType);
        sanction.setTeam(teamOpt.get());
        sanction.setMarcador(sanctionData.getMarcador());

        gameSanctionsRepository.save(sanction);

        Game updatedGame = gameRepository.findById(game.getId()).orElse(game);
        broadcastService.broadcastGameUpdate(game.getUniqueCode(), updatedGame, "SANCTION");

        return GameUpdateMessage.sanctionUpdate(updatedGame);
    }
}
