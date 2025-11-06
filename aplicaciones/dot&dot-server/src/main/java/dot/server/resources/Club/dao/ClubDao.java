package dot.server.resources.Club.dao;

import dot.server.resources.Club.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubDao extends JpaRepository<Club, Long> {
}
