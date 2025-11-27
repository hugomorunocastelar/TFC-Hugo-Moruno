package dot.server.data.Match.repository;

import dot.server.data.Match.model.GameRefereeTeam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRefereeTeamRepository extends JpaRepository<GameRefereeTeam, Long> {
}
