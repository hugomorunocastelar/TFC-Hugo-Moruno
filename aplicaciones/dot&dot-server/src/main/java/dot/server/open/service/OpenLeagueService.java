package dot.server.open.service;

import dot.server.resources.MatchDefinitions.entity.League;

import java.util.List;

public interface OpenLeagueService {
    League findById(Long id);
    List<League> findAll();
}
