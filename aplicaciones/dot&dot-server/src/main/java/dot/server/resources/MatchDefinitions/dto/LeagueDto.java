package dot.server.resources.MatchDefinitions.dto;

import dot.server.resources.Definitions.Category;
import dot.server.resources.MatchDefinitions.entity.League;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class LeagueDto {

    private long id;
    private String name;
    private Category category;
    private CompetitionDto competition;
    private String codePrefix;

    public static LeagueDto from(League league) {
        if (league == null) {
            return null;
        }
        LeagueDto dto = new LeagueDto();
        dto.setId(league.getId());
        dto.setName(league.getName());
        dto.setCategory(league.getCategory());
        dto.setCompetition(CompetitionDto.from(league.getCompetition()));
        dto.setCodePrefix(league.getCodePrefix());
        return dto;
    }

    public static League to(LeagueDto dto) {
        if (dto == null) {
            return null;
        }
        League league = new League();
        if (dto.getId() != 0) {
            league.setId(dto.getId());
        }
        league.setName(dto.getName());
        league.setCategory(dto.getCategory());
        league.setCompetition(CompetitionDto.to(dto.getCompetition()));
        league.setCodePrefix(dto.getCodePrefix());
        return league;
    }

    public static List<LeagueDto> from(List<League> leagues) {
        if (leagues == null) {
            return null;
        }
        return leagues.stream()
                .map(LeagueDto::from)
                .collect(Collectors.toList());
    }

    public static List<League> to(List<LeagueDto> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(LeagueDto::to)
                .collect(Collectors.toList());
    }
}
