package dot.server.serverApp.model.Match.dao;

import dot.server.serverApp.model.Match.entity.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameResultDao extends JpaRepository<GameResult, Long> {}
