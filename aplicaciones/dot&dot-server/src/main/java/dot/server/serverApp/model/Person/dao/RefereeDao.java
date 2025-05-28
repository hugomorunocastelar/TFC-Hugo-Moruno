package dot.server.serverApp.model.Person.dao;

import dot.server.serverApp.model.Person.entity.Coach;
import dot.server.serverApp.model.Person.entity.Referee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RefereeDao extends JpaRepository<Referee, Long> {}
