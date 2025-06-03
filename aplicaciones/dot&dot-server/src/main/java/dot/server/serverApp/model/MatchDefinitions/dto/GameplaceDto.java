package dot.server.serverApp.model.MatchDefinitions.dto;

import dot.server.serverApp.model.MatchDefinitions.entity.Gameplace;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class GameplaceDto {

    private long id;
    private String name;
    private int gamefields = 1;
    private String address;
    private CityDto idCity;

    public static GameplaceDto fromEntity(Gameplace gameplace) {
        if (gameplace == null) {
            return null;
        }
        GameplaceDto dto = new GameplaceDto();
        dto.setId(gameplace.getId());
        dto.setName(gameplace.getName());
        dto.setGamefields(gameplace.getGamefields());
        dto.setAddress(gameplace.getAddress());
        dto.setIdCity(CityDto.fromEntity(gameplace.getIdCity()));
        return dto;
    }

    public static Gameplace toEntity(GameplaceDto dto) {
        if (dto == null) {
            return null;
        }
        Gameplace gameplace = new Gameplace();
        gameplace.setId(dto.getId());
        gameplace.setName(dto.getName());
        gameplace.setGamefields(dto.getGamefields());
        gameplace.setAddress(dto.getAddress());
        gameplace.setIdCity(CityDto.toEntity(dto.getIdCity()));
        return gameplace;
    }

    public static List<GameplaceDto> fromEntityList(List<Gameplace> gameplaces) {
        if (gameplaces == null) {
            return null;
        }
        return gameplaces.stream()
                .map(GameplaceDto::fromEntity)
                .collect(Collectors.toList());
    }

    public static List<Gameplace> toEntityList(List<GameplaceDto> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(GameplaceDto::toEntity)
                .collect(Collectors.toList());
    }
}
