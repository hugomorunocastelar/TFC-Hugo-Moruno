package dot.server.serverApp.model.Match.dto;

import dot.server.serverApp.model.Match.dto.DtoMapper;
import dot.server.serverApp.model.Match.dto.GameDto;
import dot.server.serverApp.model.Match.entity.GameDetails;
import dot.server.serverApp.model.Definitions.Category;
import dot.server.serverApp.model.Definitions.Division;
import dot.server.serverApp.model.MatchDefinitions.dto.CityDto;
import dot.server.serverApp.model.MatchDefinitions.dto.CompetitionDto;
import lombok.Data;

@Data
public class GameDetailsDto implements DtoMapper<GameDetails, GameDetailsDto> {

    private long id;
    private GameDto game;
    private Category category;
    private Division division;
    private CompetitionDto competition;
    private CityDto city;

    // Getters and setters

    @Override
    public GameDetailsDto toDto(GameDetails entity) {
        if (entity == null) return null;
        GameDetailsDto dto = new GameDetailsDto();
        dto.setId(entity.getId());
        dto.setGame(new GameDto().toDto(entity.getGame()));
        dto.setCategory(entity.getCategory());
        dto.setDivision(entity.getDivision());
        dto.setCompetition(CompetitionDto.from(entity.getCompetition()));
        dto.setCity(CityDto.from(entity.getCity()));
        return dto;
    }

    @Override
    public GameDetails fromDto(GameDetailsDto dto) {
        if (dto == null) return null;
        GameDetails entity = new GameDetails();
        entity.setId(dto.getId());
        entity.setGame(new GameDto().fromDto(dto.getGame()));
        entity.setCategory(dto.getCategory());
        entity.setDivision(dto.getDivision());
        entity.setCompetition(CompetitionDto.to(dto.getCompetition()));
        entity.setCity(CityDto.to(dto.getCity()));
        return entity;
    }
}
