package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.CitiesService;
import dot.server.serverApp.model.MatchDefinitions.dao.CityDao;
import dot.server.serverApp.model.MatchDefinitions.dto.CityDto;
import dot.server.serverApp.model.MatchDefinitions.entity.City;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CitiesServiceImpl implements CitiesService {

    private final CityDao cityDao;

    public CitiesServiceImpl(CityDao cityDao) {
        this.cityDao = cityDao;
    }

    @Override
    public List<CityDto> findAll() {
        List<City> cities = cityDao.findAll();
        return CityDto.fromEntityList(cities);
    }

    @Override
    public Optional<CityDto> findById(Long id) {
        Optional<City> cityOpt = cityDao.findById(id);
        return cityOpt.map(CityDto::fromEntity);
    }

    @Override
    public CityDto save(CityDto cityDto) {
        City city = CityDto.toEntity(cityDto);
        City savedCity = cityDao.save(city);
        return CityDto.fromEntity(savedCity);
    }

    @Override
    public CityDto update(Long id, CityDto cityDto) {
        Optional<City> cityOpt = cityDao.findById(id);
        if (cityOpt.isEmpty()) {
            throw new RuntimeException("City not found with id " + id);
        }
        City cityToUpdate = cityOpt.get();
        // Update fields
        cityToUpdate.setName(cityDto.getName());
        cityToUpdate.setRegion(cityDto.getRegion());
        cityToUpdate.setFirstPC(cityDto.getFirstPC());
        cityToUpdate.setLastPC(cityDto.getLastPC());

        City updatedCity = cityDao.save(cityToUpdate);
        return CityDto.fromEntity(updatedCity);
    }

    @Override
    public void deleteById(Long id) {
        cityDao.deleteById(id);
    }
}
