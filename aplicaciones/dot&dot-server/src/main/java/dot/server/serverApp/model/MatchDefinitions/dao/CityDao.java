package dot.server.serverApp.model.MatchDefinitions.dao;

import dot.server.serverApp.model.Match.entity.Game;
import dot.server.serverApp.model.MatchDefinitions.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityDao extends JpaRepository<City, Long> {}
