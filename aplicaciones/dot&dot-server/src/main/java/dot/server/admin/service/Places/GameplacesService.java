package dot.server.admin.service.Places;

import dot.server.resources.MatchDefinitions.dto.GameplaceDto;

import java.util.List;
import java.util.Optional;

public interface GameplacesService {

    GameplaceDto createGameplace(GameplaceDto gameplaceDto);

    Optional<GameplaceDto> getGameplaceById(Long id);

    List<GameplaceDto> getAllGameplaces();

    GameplaceDto updateGameplace(Long id, GameplaceDto gameplaceDto);

    void deleteGameplace(Long id);
}
