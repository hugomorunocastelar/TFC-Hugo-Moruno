package dot.server.serverApp.model.Match.dao;

import dot.server.serverApp.model.Match.entity.GameDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameDetailsDao extends JpaRepository<GameDetails, Long> {}
