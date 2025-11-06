package dot.server.resources.MatchDefinitions.dao;

import dot.server.resources.MatchDefinitions.entity.Gameplace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameplaceDao extends JpaRepository<Gameplace, Long> {}
