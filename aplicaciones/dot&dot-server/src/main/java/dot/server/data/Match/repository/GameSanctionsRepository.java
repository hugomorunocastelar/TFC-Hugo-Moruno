package dot.server.data.Match.repository;

import dot.server.data.Match.model.GameSanctions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSanctionsRepository extends JpaRepository<GameSanctions, Long> {
}
