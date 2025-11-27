package dot.server.data.MatchDefinitions.dao;

import dot.server.data.MatchDefinitions.entity.Competition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompetitionDao extends JpaRepository<Competition, Long> {
}
