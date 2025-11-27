package dot.server.data.Match.repository;

import dot.server.data.Match.model.GameObservations;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameObservationsRepository extends JpaRepository<GameObservations, Long> {
}
