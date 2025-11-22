package dot.server.resources.MatchDefinitions.dao;

import dot.server.resources.MatchDefinitions.entity.Season;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeasonDao extends JpaRepository<Season, Long> {
}
