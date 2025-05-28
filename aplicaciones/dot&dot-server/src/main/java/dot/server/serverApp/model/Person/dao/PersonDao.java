package dot.server.serverApp.model.Person.dao;

import dot.server.serverApp.model.Person.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonDao extends JpaRepository<Person, Long> {

    Optional<Person> findByDni(String dni);

}
