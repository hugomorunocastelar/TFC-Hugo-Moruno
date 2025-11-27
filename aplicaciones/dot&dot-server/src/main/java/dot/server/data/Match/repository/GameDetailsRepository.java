package dot.server.data.Match.repository;

import dot.server.data.Match.model.GameDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameDetailsRepository extends JpaRepository<GameDetails, Long> {
}
