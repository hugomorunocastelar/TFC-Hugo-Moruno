package dot.server.serverApp.model.Club.dao;

import dot.server.serverApp.model.Club.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClubDao extends JpaRepository<Club, Long> {
}
