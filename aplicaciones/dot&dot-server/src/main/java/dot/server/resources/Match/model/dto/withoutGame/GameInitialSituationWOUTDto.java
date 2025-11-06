package dot.server.resources.Match.model.dto.withoutGame;

import dot.server.resources.Club.dto.TeamDto;
import dot.server.resources.Match.model.dto.DtoMapper;
import dot.server.resources.Match.model.GameInitialSituation;
import lombok.Data;

@Data
public class GameInitialSituationWOUTDto implements DtoMapper<GameInitialSituation, GameInitialSituationWOUTDto> {

    private long id;
    private TeamDto localTeam;
    private TeamDto visitTeam;
    private TeamDto startingTeam;
    private TeamDto leftTeam;

    @Override
    public GameInitialSituationWOUTDto to(GameInitialSituation entity) {
        if (entity == null) return null;
        GameInitialSituationWOUTDto dto = new GameInitialSituationWOUTDto();
        dto.setId(entity.getId());
        dto.setLocalTeam(TeamDto.from(entity.getLocalTeam()));
        dto.setVisitTeam(TeamDto.from(entity.getVisitTeam()));
        dto.setStartingTeam(TeamDto.from(entity.getStartingTeam()));
        dto.setLeftTeam(TeamDto.from(entity.getLeftTeam()));
        return dto;
    }

    @Override
    public GameInitialSituation from(GameInitialSituationWOUTDto dto) {
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
