package dot.server.data.MatchDefinitions.dao;

import dot.server.data.MatchDefinitions.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityDao extends JpaRepository<City, Long> {
}
