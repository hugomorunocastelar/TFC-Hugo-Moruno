package dot.server.data.Match.repository;

import dot.server.data.Match.model.GameInitialSituation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameInitialSituationRepository extends JpaRepository<GameInitialSituation, Long> {
}
