package dot.server.serverApp.model.Club.dao;

import dot.server.serverApp.model.Club.entity.Club;
import dot.server.serverApp.model.Club.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamDao extends JpaRepository<Team, Long> {
}
