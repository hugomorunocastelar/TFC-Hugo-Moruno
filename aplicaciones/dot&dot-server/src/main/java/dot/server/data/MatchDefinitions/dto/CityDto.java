package dot.server.data.MatchDefinitions.dto;

import dot.server.data.MatchDefinitions.entity.City;
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
    private Double latitude;
    private Double longitude;

    public static CityDto from(City city) {
        if (city == null) {
            return null;
        }
        CityDto dto = new CityDto();
        dto.setId(city.getId());
        dto.setName(city.getName());
        dto.setRegion(city.getRegion());
        dto.setFirstPC(city.getFirstPC());
        dto.setLastPC(city.getLastPC());
        dto.setLatitude(city.getLatitude());
        dto.setLongitude(city.getLongitude());
        return dto;
    }

    public static City to(CityDto dto) {
        if (dto == null) {
            return null;
        }
        City city = new City();
        if (dto.getId() != 0) {
            city.setId(dto.getId());
        }
        city.setName(dto.getName());
        city.setRegion(dto.getRegion());
        city.setFirstPC(dto.getFirstPC());
        city.setLastPC(dto.getLastPC());
        city.setLatitude(dto.getLatitude());
        city.setLongitude(dto.getLongitude());
        return city;
    }

    public static List<CityDto> from(List<City> cities) {
        if (cities == null) {
            return null;
        }
        return cities.stream()
                .map(CityDto::from)
                .collect(Collectors.toList());
    }

    public static List<City> to(List<CityDto> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(CityDto::to)
                .collect(Collectors.toList());
    }
}
