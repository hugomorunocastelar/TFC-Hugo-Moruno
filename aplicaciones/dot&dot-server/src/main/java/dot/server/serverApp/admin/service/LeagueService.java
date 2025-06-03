package dot.server.serverApp.admin.service;

import dot.server.serverApp.model.MatchDefinitions.entity.League;

import java.util.List;

public interface LeagueService {

    League save(League league);

    League findById(Long id);

    List<League> findAll();

    void deleteById(Long id);

}
