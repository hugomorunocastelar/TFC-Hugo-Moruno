package dot.server.serverApp.model.Match.dao;

import dot.server.serverApp.model.Match.entity.GameRefereeTeam;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRefereeTeamDao extends JpaRepository<GameRefereeTeam, Long> {}
