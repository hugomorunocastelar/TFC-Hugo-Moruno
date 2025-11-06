package dot.server.serverApp.admin.service.Definitions;

import dot.server.serverApp.model.MatchDefinitions.dto.SeasonDto;

import java.util.List;
import java.util.Optional;

public interface SeasonService {

    List<SeasonDto> findAll();

    Optional<SeasonDto> findById(Long id);

    SeasonDto save(SeasonDto seasonDto);

    SeasonDto update(Long id, SeasonDto seasonDto);

    void deleteById(Long id);
}
