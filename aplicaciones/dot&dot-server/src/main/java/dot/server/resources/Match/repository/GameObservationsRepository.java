package dot.server.resources.Match.repository;

import dot.server.resources.Match.model.GameObservations;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameObservationsRepository extends JpaRepository<GameObservations, Long> {
}
