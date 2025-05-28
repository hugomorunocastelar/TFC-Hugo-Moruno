package dot.server.serverApp.model.Match.dao;

import dot.server.serverApp.model.Match.entity.GameObservations;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameObservationsDao extends JpaRepository<GameObservations, Long> {}
