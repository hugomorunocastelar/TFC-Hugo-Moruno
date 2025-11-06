package dot.server.serverApp.admin.service;

import dot.server.serverApp.model.MatchDefinitions.dto.GameplaceDto;

import java.util.List;
import java.util.Optional;

public interface GameplacesService {

    GameplaceDto createGameplace(GameplaceDto gameplaceDto);

    Optional<GameplaceDto> getGameplaceById(Long id);

    List<GameplaceDto> getAllGameplaces();

    GameplaceDto updateGameplace(Long id, GameplaceDto gameplaceDto);

    void deleteGameplace(Long id);
}
