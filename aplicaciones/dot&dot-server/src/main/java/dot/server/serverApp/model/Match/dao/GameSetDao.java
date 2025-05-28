package dot.server.serverApp.model.Match.dao;

import dot.server.serverApp.model.Match.entity.GameSet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSetDao extends JpaRepository<GameSet, Long> {}
