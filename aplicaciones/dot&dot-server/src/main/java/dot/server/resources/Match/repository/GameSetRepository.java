package dot.server.resources.Match.repository;

import dot.server.resources.Match.model.GameSet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSetRepository extends JpaRepository<GameSet, Long> {
}
