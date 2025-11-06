package dot.server.serverApp.model.Match.dto;

import dot.server.serverApp.model.Match.dto.DtoMapper;
import dot.server.serverApp.model.Match.dto.GameDto;
import dot.server.serverApp.model.Match.entity.GameSet;
import lombok.Data;

import java.util.Date;

@Data
public class GameSetDto implements DtoMapper<GameSet, GameSetDto> {

    private long id;
    private GameDto game;
    private int pointsLocal;
    private int pointsVisit;
    private Date timeStart;
    private Date timeEnd;
    private String localAlignment;
    private String visitAlignment;

    // Getters and setters

    @Override
    public GameSetDto to(GameSet entity) {
        if (entity == null) return null;
        GameSetDto dto = new GameSetDto();
        dto.setId(entity.getId());
        dto.setGame(new GameDto().to(entity.getGame()));
        dto.setPointsLocal(entity.getPointsLocal());
        dto.setPointsVisit(entity.getPointsVisit());
        dto.setTimeStart(entity.getTimeStart());
        dto.setTimeEnd(entity.getTimeEnd());
        dto.setLocalAlignment(entity.getLocalAlignment());
        dto.setVisitAlignment(entity.getVisitAlignment());
        return dto;
    }

    @Override
    public GameSet from(GameSetDto dto) {
        if (dto == null) return null;
        GameSet entity = new GameSet();
        entity.setId(dto.getId());
        entity.setGame(new GameDto().from(dto.getGame()));
        entity.setPointsLocal(dto.getPointsLocal());
        entity.setPointsVisit(dto.getPointsVisit());
        entity.setTimeStart(dto.getTimeStart());
        entity.setTimeEnd(dto.getTimeEnd());
        entity.setLocalAlignment(dto.getLocalAlignment());
        entity.setVisitAlignment(dto.getVisitAlignment());
        return entity;
    }
}
