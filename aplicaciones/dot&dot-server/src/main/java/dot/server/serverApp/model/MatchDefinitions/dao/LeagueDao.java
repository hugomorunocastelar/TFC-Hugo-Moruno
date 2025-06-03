package dot.server.serverApp.model.MatchDefinitions.dao;

import dot.server.serverApp.model.MatchDefinitions.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeagueDao extends JpaRepository<League, Long> {}
