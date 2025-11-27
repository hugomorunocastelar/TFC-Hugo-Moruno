package dot.server.data.MatchDefinitions.dao;

import dot.server.data.MatchDefinitions.entity.Season;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeasonDao extends JpaRepository<Season, Long> {
}
