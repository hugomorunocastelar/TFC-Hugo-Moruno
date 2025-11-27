package dot.server.data.MatchDefinitions.dao;

import dot.server.data.MatchDefinitions.entity.Gameplace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameplaceDao extends JpaRepository<Gameplace, Long> {
}
