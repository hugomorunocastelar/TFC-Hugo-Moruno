package dot.server.open.service;

import dot.server.data.MatchDefinitions.entity.Competition;

import java.util.List;

public interface OpenCompetitionService {
    Competition findById(Long id);

    List<Competition> findAll();
}
