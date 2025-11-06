package dot.server.serverApp.admin.service;

import dot.server.serverApp.model.MatchDefinitions.dto.LeagueDto;

import java.util.List;

public interface LeagueService {

    LeagueDto save(LeagueDto leagueDto);

    LeagueDto findById(Long id);

    List<LeagueDto> findAll();

    void deleteById(Long id);

}
