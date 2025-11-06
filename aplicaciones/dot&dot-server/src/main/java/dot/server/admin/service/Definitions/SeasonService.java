package dot.server.admin.service.Definitions;

import dot.server.resources.MatchDefinitions.dto.SeasonDto;

import java.util.List;
import java.util.Optional;

public interface SeasonService {

    List<SeasonDto> findAll();

    Optional<SeasonDto> findById(Long id);

    SeasonDto save(SeasonDto seasonDto);

    SeasonDto update(Long id, SeasonDto seasonDto);

    void deleteById(Long id);
}
