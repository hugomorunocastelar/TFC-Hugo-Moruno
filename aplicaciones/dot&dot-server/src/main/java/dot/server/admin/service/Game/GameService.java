package dot.server.admin.service.Game;


import dot.server.data.Match.model.dto.GameDto;
import dot.server.data.Match.model.dto.GameSummaryDto;
import dot.server.data.Match.model.dto.request.CreateGameRequest;
import dot.server.data.Match.model.dto.request.UpdateGameRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface GameService {
    List<GameDto> findAll();

    List<GameSummaryDto> findSummerizedAll();

    GameSummaryDto getOutstandingMatch();

    Optional<GameDto> findById(Long id);
    
    Optional<GameDto> findByUniqueCode(String uniqueCode);

    GameDto create(CreateGameRequest request);

    Optional<GameDto> update(Long id, UpdateGameRequest request);

    boolean delete(Long id);
}
