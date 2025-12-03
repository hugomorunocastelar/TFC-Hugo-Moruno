package dot.server.websocket.service;

import dot.server.data.Match.model.Game;
import dot.server.websocket.dto.GameUpdateMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class LiveGameBroadcastService {

    private final SimpMessagingTemplate websocketTemplate;
    private final Map<String, List<SseEmitter>> sseEmitters = new ConcurrentHashMap<>();

    public void broadcastGameUpdate(String uniqueCode, Game game, String updateType) {
        GameUpdateMessage message = switch (updateType) {
            case "POINTS" -> GameUpdateMessage.pointsUpdate(game);
            case "SANCTION" -> GameUpdateMessage.sanctionUpdate(game);
            case "STARTED" -> GameUpdateMessage.gameStarted(game);
            case "FINISHED" -> GameUpdateMessage.gameFinished(game);
            case "SET_FINISHED" -> GameUpdateMessage.setFinished(game);
            default -> new GameUpdateMessage(updateType, game);
        };

        broadcastViaWebSocket(uniqueCode, message);
        broadcastViaSse(uniqueCode, message);
    }

    private void broadcastViaWebSocket(String uniqueCode, GameUpdateMessage message) {
        try {
            websocketTemplate.convertAndSend("/topic/game/" + uniqueCode, message);
            log.info("Broadcast WebSocket update for game {}: {}", uniqueCode, message.getType());
        } catch (Exception e) {
            log.error("Error broadcasting via WebSocket for game {}: {}", uniqueCode, e.getMessage());
        }
    }

    private void broadcastViaSse(String uniqueCode, GameUpdateMessage message) {
        List<SseEmitter> emitters = sseEmitters.get(uniqueCode);
        if (emitters == null || emitters.isEmpty()) {
            return;
        }

        List<SseEmitter> deadEmitters = new ArrayList<>();
        
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("game-update")
                        .data(message));
            } catch (IOException e) {
                deadEmitters.add(emitter);
                log.warn("Dead SSE emitter detected for game {}", uniqueCode);
            }
        }

        emitters.removeAll(deadEmitters);
        log.info("Broadcast SSE update for game {} to {} clients", uniqueCode, emitters.size());
    }

    public void registerSseEmitter(String uniqueCode, SseEmitter emitter) {
        sseEmitters.computeIfAbsent(uniqueCode, k -> new ArrayList<>()).add(emitter);
        log.info("New SSE client registered for game {}. Total clients: {}", 
                uniqueCode, sseEmitters.get(uniqueCode).size());
    }

    public void unregisterSseEmitter(String uniqueCode, SseEmitter emitter) {
        List<SseEmitter> emitters = sseEmitters.get(uniqueCode);
        if (emitters != null) {
            emitters.remove(emitter);
            log.info("SSE client unregistered for game {}. Remaining clients: {}", 
                    uniqueCode, emitters.size());
            
            if (emitters.isEmpty()) {
                sseEmitters.remove(uniqueCode);
            }
        }
    }

    public int getActiveConnectionsCount(String uniqueCode) {
        List<SseEmitter> emitters = sseEmitters.get(uniqueCode);
        return emitters != null ? emitters.size() : 0;
    }
}
