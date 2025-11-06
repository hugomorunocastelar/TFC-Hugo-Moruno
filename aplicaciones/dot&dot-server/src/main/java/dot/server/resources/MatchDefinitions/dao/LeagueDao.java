package dot.server.resources.MatchDefinitions.dao;

import dot.server.resources.MatchDefinitions.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeagueDao extends JpaRepository<League, Long> {}
