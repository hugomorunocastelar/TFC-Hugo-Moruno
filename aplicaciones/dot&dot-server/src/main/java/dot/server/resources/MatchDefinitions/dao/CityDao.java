package dot.server.resources.MatchDefinitions.dao;

import dot.server.resources.MatchDefinitions.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityDao extends JpaRepository<City, Long> {}
