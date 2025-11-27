package dot.server.open.service;

import dot.server.data.MatchDefinitions.entity.League;

import java.util.List;

public interface OpenLeagueService {
    League findById(Long id);

    List<League> findAll();
}
