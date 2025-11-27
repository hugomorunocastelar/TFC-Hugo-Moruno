package dot.server.data.Person.dao;

import dot.server.data.Person.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayerDao extends JpaRepository<Player, Long> {
}
