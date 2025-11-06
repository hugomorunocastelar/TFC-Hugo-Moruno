package dot.server.admin.service.Definitions;

import dot.server.resources.MatchDefinitions.dto.CompetitionDto;

import java.util.List;
import java.util.Optional;

public interface CompetitionService {

    CompetitionDto createCompetition(CompetitionDto competitionDto);

    Optional<CompetitionDto> getCompetitionById(Long id);

    List<CompetitionDto> getAllCompetitions();

    CompetitionDto updateCompetition(Long id, CompetitionDto competitionDto);

    void deleteCompetition(Long id);
}
