package dot.server.resources.Match.model.dto;

import dot.server.resources.Club.dto.TeamDto;
import dot.server.resources.Match.model.GameResult;
import lombok.Data;

import java.util.Date;

@Data
public class GameResultDto implements DtoMapper<GameResult, GameResultDto> {

    private long id;
    private GameDto game;
    private int pointsLocal;
    private int pointsVisit;
    private TeamDto winnerTeam;
    private Date timeStart;
    private Date timeEnd;
    private int duration;

    @Override
    public GameResultDto to(GameResult entity) {
        if (entity == null) return null;
        GameResultDto dto = new GameResultDto();
        dto.setId(entity.getId());
        dto.setGame(new GameDto().to(entity.getGame()));
        dto.setPointsLocal(entity.getPointsLocal());
        dto.setPointsVisit(entity.getPointsVisit());
        dto.setWinnerTeam(TeamDto.from(entity.getWinnerTeam()));
        dto.setTimeStart(entity.getTimeStart());
        dto.setTimeEnd(entity.getTimeEnd());
        dto.setDuration(entity.getDuration());
        return dto;
    }

    @Override
    public GameResult from(GameResultDto dto) {
        if (dto == null) return null;
        GameResult entity = new GameResult();
        entity.setId(dto.getId());
        entity.setGame(new GameDto().from(dto.getGame()));
        entity.setPointsLocal(dto.getPointsLocal());
        entity.setPointsVisit(dto.getPointsVisit());
        entity.setWinnerTeam(TeamDto.to(dto.getWinnerTeam()));
        entity.setTimeStart(dto.getTimeStart());
        entity.setTimeEnd(dto.getTimeEnd());
        entity.setDuration(dto.getDuration());
        return entity;
    }
}
