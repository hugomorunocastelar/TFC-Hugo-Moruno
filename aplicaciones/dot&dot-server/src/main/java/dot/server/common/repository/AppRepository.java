package dot.server.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppRepository<Class> extends JpaRepository<Class, Long> {
    Optional<Class> findByName(String name);
}
