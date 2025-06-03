package dot.server.serverApp.model.MatchDefinitions.dto;

import dot.server.serverApp.model.MatchDefinitions.entity.City;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class CityDto {

    private long id;
    private String name;
    private String region;
    private String firstPC;
    private String lastPC;

    public static CityDto fromEntity(City city) {
        if (city == null) {
            return null;
        }
        CityDto dto = new CityDto();
        dto.setId(city.getId());
        dto.setName(city.getName());
        dto.setRegion(city.getRegion());
        dto.setFirstPC(city.getFirstPC());
        dto.setLastPC(city.getLastPC());
        return dto;
    }

    public static City toEntity(CityDto dto) {
        if (dto == null) {
            return null;
        }
        City city = new City();
        city.setId(dto.getId());
        city.setName(dto.getName());
        city.setRegion(dto.getRegion());
        city.setFirstPC(dto.getFirstPC());
        city.setLastPC(dto.getLastPC());
        return city;
    }

    public static List<CityDto> fromEntityList(List<City> cities) {
        if (cities == null) {
            return null;
        }
        return cities.stream()
                .map(CityDto::fromEntity)
                .collect(Collectors.toList());
    }

    public static List<City> toEntityList(List<CityDto> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(CityDto::toEntity)
                .collect(Collectors.toList());
    }
}
