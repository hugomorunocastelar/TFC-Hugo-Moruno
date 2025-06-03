package dot.server.serverApp.model.MatchDefinitions.dto;

import dot.server.serverApp.model.MatchDefinitions.entity.Season;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class SeasonDto {

    private long id;
    private String name;
    private Date initialDay;
    private Date finalisationDay;

    public static SeasonDto fromEntity(Season season) {
        if (season == null) {
            return null;
        }
        SeasonDto dto = new SeasonDto();
        dto.setId(season.getId());
        dto.setName(season.getName());
        dto.setInitialDay(season.getInitialDay());
        dto.setFinalisationDay(season.getFinalisationDay());
        return dto;
    }

    public static Season toEntity(SeasonDto dto) {
        if (dto == null) {
            return null;
        }
        Season season = new Season();
        season.setId(dto.getId());
        season.setName(dto.getName());
        season.setInitialDay(dto.getInitialDay());
        season.setFinalisationDay(dto.getFinalisationDay());
        return season;
    }

    public static List<SeasonDto> fromEntityList(List<Season> seasons) {
        if (seasons == null) {
            return null;
        }
        return seasons.stream()
                .map(SeasonDto::fromEntity)
                .collect(Collectors.toList());
    }

    public static List<Season> toEntityList(List<SeasonDto> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(SeasonDto::toEntity)
                .collect(Collectors.toList());
    }
}
