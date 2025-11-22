package dot.server.admin.service.Game;


import dot.server.resources.Match.model.dto.GameDto;
import dot.server.resources.Match.model.dto.GameSummaryDto;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface GameService {
    List<GameDto> findAll();

    List<GameSummaryDto> findSummerizedAll();

    GameSummaryDto getOutstandingMatch();

    Optional<GameDto> findById(Long id);

    GameDto create(GameDto gameDto);

    Optional<GameDto> update(Long id, GameDto gameDto);

    boolean delete(Long id);
}
