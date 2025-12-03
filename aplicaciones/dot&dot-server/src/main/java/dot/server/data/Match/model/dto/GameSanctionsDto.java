package dot.server.data.Match.model.dto;

import dot.server.data.Club.dto.TeamDto;
import dot.server.data.Definitions.SanctionType;
import dot.server.data.Match.model.GameSanctions;
import lombok.Data;

@Data
public class GameSanctionsDto implements DtoMapper<GameSanctions, GameSanctionsDto> {

    private long id;
    private SanctionType type;
    private TeamDto team;
    private String marcador;

    @Override
    public GameSanctionsDto to(GameSanctions entity) {
        if (entity == null) return null;
        GameSanctionsDto dto = new GameSanctionsDto();
        dto.setId(entity.getId());
        dto.setType(entity.getType());
        dto.setTeam(TeamDto.from(entity.getTeam()));
        dto.setMarcador(entity.getMarcador());
        return dto;
    }

    @Override
    public GameSanctions from(GameSanctionsDto dto) {
        if (dto == null) return null;
        GameSanctions entity = new GameSanctions();
        entity.setId(dto.getId());
        entity.setType(dto.getType());
        entity.setTeam(TeamDto.to(dto.getTeam()));
        entity.setMarcador(dto.getMarcador());
        return entity;
    }
}
