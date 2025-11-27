package dot.server.data.Person.dao;

import dot.server.data.Person.entity.Referee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefereeDao extends JpaRepository<Referee, Long> {
}
