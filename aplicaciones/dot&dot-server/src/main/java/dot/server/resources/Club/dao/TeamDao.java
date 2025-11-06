package dot.server.resources.Club.dao;

import dot.server.resources.Club.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamDao extends JpaRepository<Team, Long> {
}
