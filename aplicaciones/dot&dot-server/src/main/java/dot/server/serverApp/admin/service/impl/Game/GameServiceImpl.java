package dot.server.serverApp.admin.service.Game;


import dot.server.serverApp.model.Match.dto.GameDto;

import java.util.List;
import java.util.Optional;

public interface GameService {
    List<GameDto> findAll();
    Optional<GameDto> findById(Long id);
    GameDto create(GameDto gameDto);
    Optional<GameDto> update(Long id, GameDto gameDto);
    boolean delete(Long id);
}
