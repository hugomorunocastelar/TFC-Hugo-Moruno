package dot.server.open.controller;

import dot.server.data.Match.model.Game;
import dot.server.data.Match.model.dto.GameSummaryDto;
import dot.server.data.Match.repository.GameRepository;
import dot.server.data.Match.service.MatchService;
import dot.server.websocket.dto.GameUpdateMessage;
import dot.server.websocket.service.LiveGameBroadcastService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/open/matches")
@RequiredArgsConstructor
@Slf4j
public class OpenMatchesController {

    private final MatchService matchService;
    private final LiveGameBroadcastService broadcastService;
    private final GameRepository gameRepository;

    @GetMapping("/league/{leagueId}")
    public ResponseEntity<?> getGamesByLeague(@PathVariable Long leagueId) {
        return ResponseEntity.ok(matchService.getGamesByLeague(leagueId));
    }

    @GetMapping("/competition/{competitionId}")
    public ResponseEntity<?> getGamesByCompetition(@PathVariable Long competitionId) {
        return ResponseEntity.ok(matchService.getGamesByCompetition(competitionId));
    }

    @GetMapping("/live/{uniqueCode}/initial")
    public ResponseEntity<?> getGameInitialState(@PathVariable String uniqueCode) {
        log.info("Fetching initial game state for: {}", uniqueCode);

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            return ResponseEntity.status(404)
                    .body(java.util.Map.of("error", "Game not found with uniqueCode: " + uniqueCode));
        }

        Game game = gameOpt.get();
        dot.server.data.Match.model.dto.GameDto gameDto = new dot.server.data.Match.model.dto.GameDto().to(game);
        
        return ResponseEntity.ok(gameDto);
    }

    @GetMapping(value = "/live/{uniqueCode}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamGameUpdates(@PathVariable String uniqueCode) {
        log.info("New SSE connection request for game: {}", uniqueCode);

        Optional<Game> gameOpt = gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst();

        if (gameOpt.isEmpty()) {
            log.error("Game not found for SSE stream: {}", uniqueCode);
            SseEmitter emitter = new SseEmitter(0L);
            try {
                emitter.send(SseEmitter.event()
                        .name("error")
                        .data("Game not found"));
                emitter.complete();
            } catch (Exception e) {
                log.error("Error sending error message: {}", e.getMessage());
            }
            return emitter;
        }

        Game game = gameOpt.get();
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        broadcastService.registerSseEmitter(uniqueCode, emitter);

        emitter.onCompletion(() -> {
            log.info("SSE connection completed for game: {}", uniqueCode);
            broadcastService.unregisterSseEmitter(uniqueCode, emitter);
        });

        emitter.onTimeout(() -> {
            log.warn("SSE connection timeout for game: {}", uniqueCode);
            broadcastService.unregisterSseEmitter(uniqueCode, emitter);
        });

        emitter.onError((ex) -> {
            log.error("SSE connection error for game {}: {}", uniqueCode, ex.getMessage());
            broadcastService.unregisterSseEmitter(uniqueCode, emitter);
        });

        try {
            emitter.send(SseEmitter.event()
                    .name("connected")
                    .data(GameUpdateMessage.pointsUpdate(game)));
            log.info("Initial game state sent to SSE client for game: {}", uniqueCode);
        } catch (Exception e) {
            log.error("Error sending initial state: {}", e.getMessage());
            broadcastService.unregisterSseEmitter(uniqueCode, emitter);
        }

        return emitter;
    }

    @GetMapping("/live/{uniqueCode}/stats")
    public ResponseEntity<?> getConnectionStats(@PathVariable String uniqueCode) {
        int activeConnections = broadcastService.getActiveConnectionsCount(uniqueCode);
        return ResponseEntity.ok(java.util.Map.of(
                "uniqueCode", uniqueCode,
                "activeConnections", activeConnections
        ));
    }
}

