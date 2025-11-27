package dot.server.data.Club.dao;

import dot.server.data.Club.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamDao extends JpaRepository<Team, Long> {
}
