package dot.server.serverApp.model.Match.dao;

import dot.server.serverApp.model.Match.entity.GameSanctions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameSanctionsDao extends JpaRepository<GameSanctions, Long> {}
