package dot.server.data.Match.model.dto;

import dot.server.data.Club.dto.TeamDto;
import dot.server.data.Match.model.GameInitialSituation;
import lombok.Data;

@Data
public class GameInitialSituationDto implements DtoMapper<GameInitialSituation, GameInitialSituationDto> {

    private long id;
    private TeamDto localTeam;
    private TeamDto visitTeam;
    private TeamDto startingTeam;
    private TeamDto leftTeam;

    @Override
    public GameInitialSituationDto to(GameInitialSituation entity) {
        if (entity == null) return null;
        GameInitialSituationDto dto = new GameInitialSituationDto();
        dto.setId(entity.getId());
        dto.setLocalTeam(TeamDto.from(entity.getLocalTeam()));
        dto.setVisitTeam(TeamDto.from(entity.getVisitTeam()));
        dto.setStartingTeam(TeamDto.from(entity.getStartingTeam()));
        dto.setLeftTeam(TeamDto.from(entity.getLeftTeam()));
        return dto;
    }

    @Override
    public GameInitialSituation from(GameInitialSituationDto dto) {
        if (dto == null) return null;
        GameInitialSituation entity = new GameInitialSituation();
        entity.setId(dto.getId());
        entity.setLocalTeam(TeamDto.to(dto.getLocalTeam()));
        entity.setVisitTeam(TeamDto.to(dto.getVisitTeam()));
        entity.setStartingTeam(TeamDto.to(dto.getStartingTeam()));
        entity.setLeftTeam(TeamDto.to(dto.getLeftTeam()));
        return entity;
    }
}
