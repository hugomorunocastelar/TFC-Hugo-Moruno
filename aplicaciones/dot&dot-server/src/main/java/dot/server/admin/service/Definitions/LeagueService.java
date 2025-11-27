package dot.server.admin.service.Definitions;

import dot.server.data.MatchDefinitions.dto.LeagueDto;

import java.util.List;

public interface LeagueService {

    LeagueDto save(LeagueDto leagueDto);

    LeagueDto findById(Long id);

    List<LeagueDto> findAll();

    void deleteById(Long id);

}
