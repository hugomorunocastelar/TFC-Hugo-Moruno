package dot.server.data.Person.dao;

import dot.server.data.Person.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PersonDao extends JpaRepository<Person, Long> {

    Optional<Person> findByDni(String dni);

}
