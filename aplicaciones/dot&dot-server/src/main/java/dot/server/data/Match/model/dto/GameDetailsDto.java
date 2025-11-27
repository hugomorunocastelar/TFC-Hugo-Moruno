package dot.server.data.Match.model.dto;

import dot.server.data.Definitions.Category;
import dot.server.data.Definitions.Division;
import dot.server.data.Match.model.GameDetails;
import dot.server.data.MatchDefinitions.dto.CityDto;
import dot.server.data.MatchDefinitions.dto.CompetitionDto;
import lombok.Data;

@Data
public class GameDetailsDto implements DtoMapper<GameDetails, GameDetailsDto> {

    private long id;
    private GameDto game;
    private Category category;
    private Division division;
    private CompetitionDto competition;
    private CityDto city;

    @Override
    public GameDetailsDto to(GameDetails entity) {
        if (entity == null) return null;
        GameDetailsDto dto = new GameDetailsDto();
        dto.setId(entity.getId());
        dto.setGame(new GameDto().to(entity.getGame()));
        dto.setCategory(entity.getCategory());
        dto.setDivision(entity.getDivision());
        dto.setCompetition(CompetitionDto.from(entity.getCompetition()));
        dto.setCity(CityDto.from(entity.getCity()));
        return dto;
    }

    @Override
    public GameDetails from(GameDetailsDto dto) {
        if (dto == null) return null;
        GameDetails entity = new GameDetails();
        entity.setId(dto.getId());
        entity.setGame(new GameDto().from(dto.getGame()));
        entity.setCategory(dto.getCategory());
        entity.setDivision(dto.getDivision());
        entity.setCompetition(CompetitionDto.to(dto.getCompetition()));
        entity.setCity(CityDto.to(dto.getCity()));
        return entity;
    }
}
