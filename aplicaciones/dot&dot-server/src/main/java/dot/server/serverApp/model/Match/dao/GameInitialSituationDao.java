package dot.server.serverApp.model.Match.dao;

import dot.server.serverApp.model.Match.entity.GameInitialSituation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameInitialSituationDao extends JpaRepository<GameInitialSituation, Long> {}
