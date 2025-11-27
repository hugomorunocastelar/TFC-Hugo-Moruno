package dot.server.data.Match.repository;

import dot.server.data.Match.model.GameResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameResultRepository extends JpaRepository<GameResult, Long> {
}
