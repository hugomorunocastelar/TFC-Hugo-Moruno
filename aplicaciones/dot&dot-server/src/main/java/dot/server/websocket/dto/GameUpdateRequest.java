package dot.server.websocket.dto;

import lombok.Data;

@Data
public class GameUpdateRequest {
    private String action;
    private Long setId;
    private String team;
    private Integer points;
    private SanctionData sanction;

    @Data
    public static class SanctionData {
        private String type;
        private Long teamId;
        private String marcador;
    }
}
