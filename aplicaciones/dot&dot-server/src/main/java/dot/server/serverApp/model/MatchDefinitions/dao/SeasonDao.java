package dot.server.serverApp.model.MatchDefinitions.dao;

import dot.server.serverApp.model.MatchDefinitions.entity.Competition;
import dot.server.serverApp.model.MatchDefinitions.entity.Gameplace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameplaceDao extends JpaRepository<Gameplace, Long> {}
