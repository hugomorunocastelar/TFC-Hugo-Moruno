package dot.server.data.Match.model.dto.withoutGame;

import dot.server.data.Club.dto.TeamDto;
import dot.server.data.Match.model.GameResult;
import dot.server.data.Match.model.dto.DtoMapper;
import lombok.Data;

import java.util.Date;

@Data
public class GameResultWOUTDto implements DtoMapper<GameResult, GameResultWOUTDto> {

    private long id;
    private int setsWonLocal;
    private int setsWonVisit;
    private int pointsLocal;
    private int pointsVisit;
    private TeamDto winnerTeam;
    private Date timeStart;
    private Date timeEnd;
    private int duration;

    @Override
    public GameResultWOUTDto to(GameResult entity) {
        if (entity == null) return null;
        GameResultWOUTDto dto = new GameResultWOUTDto();
        dto.setId(entity.getId());
        dto.setSetsWonLocal(entity.getSetsWonLocal());
        dto.setSetsWonVisit(entity.getSetsWonVisit());
        dto.setPointsLocal(entity.getPointsLocal());
        dto.setPointsVisit(entity.getPointsVisit());
        dto.setWinnerTeam(TeamDto.from(entity.getWinnerTeam()));
        dto.setTimeStart(entity.getTimeStart());
        dto.setTimeEnd(entity.getTimeEnd());
        dto.setDuration(entity.getDuration());
        return dto;
    }

    @Override
    public GameResult from(GameResultWOUTDto dto) {
        if (dto == null) return null;
        GameResult entity = new GameResult();
        entity.setId(dto.getId());
        entity.setSetsWonLocal(dto.getSetsWonLocal());
        entity.setSetsWonVisit(dto.getSetsWonVisit());
        entity.setPointsLocal(dto.getPointsLocal());
        entity.setPointsVisit(dto.getPointsVisit());
        entity.setWinnerTeam(TeamDto.to(dto.getWinnerTeam()));
        entity.setTimeStart(dto.getTimeStart());
        entity.setTimeEnd(dto.getTimeEnd());
        entity.setDuration(dto.getDuration());
        return entity;
    }
}
