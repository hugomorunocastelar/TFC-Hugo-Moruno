package dot.server.resources.Person.dao;

import dot.server.resources.Person.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoachDao extends JpaRepository<Coach, Long> {
}
