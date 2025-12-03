package dot.server.websocket.dto;

import dot.server.data.Match.model.Game;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameUpdateMessage {
    private String type;
    private Game game;
    private String message;
    private LocalDateTime timestamp;

    public GameUpdateMessage(String type, Game game) {
        this.type = type;
        this.game = game;
        this.timestamp = LocalDateTime.now();
    }

    public static GameUpdateMessage pointsUpdate(Game game) {
        return new GameUpdateMessage("POINTS_UPDATE", game, "Points updated", LocalDateTime.now());
    }

    public static GameUpdateMessage sanctionUpdate(Game game) {
        return new GameUpdateMessage("SANCTION_UPDATE", game, "Sanction added", LocalDateTime.now());
    }

    public static GameUpdateMessage gameStarted(Game game) {
        return new GameUpdateMessage("GAME_STARTED", game, "Game started", LocalDateTime.now());
    }

    public static GameUpdateMessage gameFinished(Game game) {
        return new GameUpdateMessage("GAME_FINISHED", game, "Game finished", LocalDateTime.now());
    }

    public static GameUpdateMessage setFinished(Game game) {
        return new GameUpdateMessage("SET_FINISHED", game, "Set finished", LocalDateTime.now());
    }
}
