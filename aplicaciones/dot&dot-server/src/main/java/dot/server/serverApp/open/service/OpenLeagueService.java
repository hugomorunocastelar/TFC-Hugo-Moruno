package dot.server.serverApp.open.service;

import dot.server.serverApp.model.MatchDefinitions.entity.League;

import java.util.List;

public interface OpenLeagueService {
    League findById(Long id);
    List<League> findAll();
}
