package dot.server.resources.Match.repository;

import dot.server.resources.Match.model.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameResultRepository extends JpaRepository<GameResult, Long> {
}
