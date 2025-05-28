package dot.server.serverApp.model.MatchDefinitions.dao;

import dot.server.serverApp.model.MatchDefinitions.entity.City;
import dot.server.serverApp.model.MatchDefinitions.entity.Competition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompetitionDao extends JpaRepository<Competition, Long> {}
