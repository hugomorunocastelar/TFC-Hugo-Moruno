package dot.server.data.MatchDefinitions.dto;

import dot.server.data.MatchDefinitions.entity.Gameplace;
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

    public static GameplaceDto from(Gameplace gameplace) {
        if (gameplace == null) {
            return null;
        }
        GameplaceDto dto = new GameplaceDto();
        dto.setId(gameplace.getId());
        dto.setName(gameplace.getName());
        dto.setGamefields(gameplace.getGamefields());
        dto.setAddress(gameplace.getAddress());
        dto.setIdCity(CityDto.from(gameplace.getIdCity()));
        return dto;
    }

    public static Gameplace to(GameplaceDto dto) {
        if (dto == null) {
            return null;
        }
        Gameplace gameplace = new Gameplace();
        if (dto.getId() != 0) {
            gameplace.setId(dto.getId());
        }
        gameplace.setName(dto.getName());
        gameplace.setGamefields(dto.getGamefields());
        gameplace.setAddress(dto.getAddress());
        gameplace.setIdCity(CityDto.to(dto.getIdCity()));
        return gameplace;
    }

    public static List<GameplaceDto> from(List<Gameplace> gameplaces) {
        if (gameplaces == null) {
            return null;
        }
        return gameplaces.stream()
                .map(GameplaceDto::from)
                .collect(Collectors.toList());
    }

    public static List<Gameplace> to(List<GameplaceDto> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(GameplaceDto::to)
                .collect(Collectors.toList());
    }
}
