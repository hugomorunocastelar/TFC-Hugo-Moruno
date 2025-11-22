package dot.server.resources.Match.repository;

import dot.server.resources.Match.model.GameDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameDetailsRepository extends JpaRepository<GameDetails, Long> {
}
