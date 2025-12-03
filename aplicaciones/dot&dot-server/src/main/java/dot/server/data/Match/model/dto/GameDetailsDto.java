package dot.server.data.Match.model.dto;

import dot.server.data.Definitions.Category;
import dot.server.data.Definitions.Division;
import dot.server.data.Match.model.GameDetails;
import dot.server.data.MatchDefinitions.dto.CityDto;
import dot.server.data.MatchDefinitions.dto.CompetitionDto;
import lombok.Data;

import java.time.LocalTime;
import java.util.Date;

@Data
public class GameDetailsDto implements DtoMapper<GameDetails, GameDetailsDto> {

    private long id;
    private Category category;
    private Division division;
    private CompetitionDto competition;
    private CityDto city;
    private Date date;
    private Date timeStart;

    @Override
    public GameDetailsDto to(GameDetails entity) {
        if (entity == null) return null;
        GameDetailsDto dto = new GameDetailsDto();
        dto.setId(entity.getId());
        dto.setCategory(entity.getCategory());
        dto.setDivision(entity.getDivision());
        dto.setCompetition(CompetitionDto.from(entity.getCompetition()));
        dto.setCity(CityDto.from(entity.getCity()));
        dto.setDate(entity.getDate());
        dto.setTimeStart(entity.getTimeStart());
        return dto;
    }

    @Override
    public GameDetails from(GameDetailsDto dto) {
        if (dto == null) return null;
        GameDetails entity = new GameDetails();
        entity.setId(dto.getId());
        entity.setCategory(dto.getCategory());
        entity.setDivision(dto.getDivision());
        entity.setCompetition(CompetitionDto.to(dto.getCompetition()));
        entity.setCity(CityDto.to(dto.getCity()));
        entity.setDate(dto.getDate());
        entity.setTimeStart(dto.getTimeStart());
        return entity;
    }
}
