package dot.server.serverApp.model.Person.dao;

import dot.server.serverApp.model.Person.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonDAO extends JpaRepository<Person, Long> {}
