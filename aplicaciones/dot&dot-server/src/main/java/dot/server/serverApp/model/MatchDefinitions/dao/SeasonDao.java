package dot.server.serverApp.model.MatchDefinitions.dao;

import dot.server.serverApp.model.MatchDefinitions.entity.Season;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeasonDao extends JpaRepository<Season, Long> {}
