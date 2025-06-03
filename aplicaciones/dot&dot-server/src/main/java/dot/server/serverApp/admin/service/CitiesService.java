package dot.server.serverApp.admin.service;

import dot.server.serverApp.model.MatchDefinitions.dto.CityDto;

import java.util.List;
import java.util.Optional;

public interface CitiesService {

    List<CityDto> findAll();

    Optional<CityDto> findById(Long id);

    CityDto save(CityDto cityDto);

    CityDto update(Long id, CityDto cityDto);

    void deleteById(Long id);
}
