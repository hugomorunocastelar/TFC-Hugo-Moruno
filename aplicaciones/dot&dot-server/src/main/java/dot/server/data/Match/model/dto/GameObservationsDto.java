package dot.server.data.Match.model.dto;

import dot.server.data.Match.model.GameObservations;
import lombok.Data;

@Data
public class GameObservationsDto implements DtoMapper<GameObservations, GameObservationsDto> {

    private long id;
    private GameDto game;
    private String description;

    @Override
    public GameObservationsDto to(GameObservations entity) {
        if (entity == null) return null;
        GameObservationsDto dto = new GameObservationsDto();
        dto.setId(entity.getId());
        dto.setGame(new GameDto().to(entity.getGame()));
        dto.setDescription(entity.getDescription());
        return dto;
    }

    @Override
    public GameObservations from(GameObservationsDto dto) {
        if (dto == null) return null;
        GameObservations entity = new GameObservations();
        entity.setId(dto.getId());
        entity.setGame(new GameDto().from(dto.getGame()));
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
