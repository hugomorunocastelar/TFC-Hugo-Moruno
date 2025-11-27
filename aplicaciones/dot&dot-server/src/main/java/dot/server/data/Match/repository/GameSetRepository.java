package dot.server.data.Match.repository;

import dot.server.data.Match.model.GameSet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSetRepository extends JpaRepository<GameSet, Long> {
}
