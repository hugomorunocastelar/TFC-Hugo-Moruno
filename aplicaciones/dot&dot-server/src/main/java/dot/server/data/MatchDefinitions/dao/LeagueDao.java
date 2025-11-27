package dot.server.data.MatchDefinitions.dao;

import dot.server.data.MatchDefinitions.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeagueDao extends JpaRepository<League, Long> {
}
