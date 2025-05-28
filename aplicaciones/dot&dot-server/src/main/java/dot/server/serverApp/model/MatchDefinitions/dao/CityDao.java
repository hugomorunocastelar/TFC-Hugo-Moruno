package dot.server.serverApp.model.Match.dao;

import dot.server.serverApp.model.Match.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameDao extends JpaRepository<Game, Long> {}
