package dot.server.serverApp.model.Match.dto;

import dot.server.serverApp.model.Club.dto.TeamDto;
import dot.server.serverApp.model.Match.dto.DtoMapper;
import dot.server.serverApp.model.Match.dto.GameDto;
import dot.server.serverApp.model.Match.entity.GameSanctions;
import dot.server.serverApp.model.Definitions.SanctionType;
import lombok.Data;

@Data
public class GameSanctionsDto implements DtoMapper<GameSanctions, GameSanctionsDto> {

    private long id;
    private GameDto game;
    private SanctionType type;
    private TeamDto team;
    private String marcador;

    // Getters and setters

    @Override
    public GameSanctionsDto to(GameSanctions entity) {
        if (entity == null) return null;
        GameSanctionsDto dto = new GameSanctionsDto();
        dto.setId(entity.getId());
        dto.setGame(new GameDto().to(entity.getGame()));
        dto.setType(entity.getType());
        dto.setTeam(new TeamDto().from(entity.getTeam()));
        dto.setMarcador(entity.getMarcador());
        return dto;
    }

    @Override
    public GameSanctions from(GameSanctionsDto dto) {
        if (dto == null) return null;
        GameSanctions entity = new GameSanctions();
        entity.setId(dto.getId());
        entity.setGame(new GameDto().from(dto.getGame()));
        entity.setType(dto.getType());
        entity.setTeam(new TeamDto().to(dto.getTeam()));
        entity.setMarcador(dto.getMarcador());
        return entity;
    }
}
