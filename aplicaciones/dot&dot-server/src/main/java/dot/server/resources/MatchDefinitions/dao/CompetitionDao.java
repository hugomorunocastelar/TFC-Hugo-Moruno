package dot.server.resources.MatchDefinitions.dao;

import dot.server.resources.MatchDefinitions.entity.Competition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompetitionDao extends JpaRepository<Competition, Long> {}
