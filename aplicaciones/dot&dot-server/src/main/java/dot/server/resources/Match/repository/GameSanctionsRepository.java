package dot.server.resources.Match.repository;

import dot.server.resources.Match.model.GameSanctions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSanctionsRepository extends JpaRepository<GameSanctions, Long> {
}
