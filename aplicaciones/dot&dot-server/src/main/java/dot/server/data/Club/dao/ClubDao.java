package dot.server.data.Club.dao;

import dot.server.data.Club.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubDao extends JpaRepository<Club, Long> {
}
