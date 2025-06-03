package dot.server.serverApp.model.MatchDefinitions.dto;

import dot.server.serverApp.model.Definitions.Category;
import dot.server.serverApp.model.MatchDefinitions.entity.League;
import dot.server.serverApp.model.MatchDefinitions.dto.CompetitionDto;
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

    public static LeagueDto fromEntity(League league) {
        if (league == null) {
            return null;
        }
        LeagueDto dto = new LeagueDto();
        dto.setId(league.getId());
        dto.setName(league.getName());
        dto.setCategory(league.getCategory());
        dto.setCompetition(CompetitionDto.fromEntity(league.getCompetition()));
        dto.setCodePrefix(league.getCodePrefix());
        return dto;
    }

    public static League toEntity(LeagueDto dto) {
        if (dto == null) {
            return null;
        }
        League league = new League();
        league.setId(dto.getId());
        league.setName(dto.getName());
        league.setCategory(dto.getCategory());
        league.setCompetition(CompetitionDto.toEntity(dto.getCompetition()));
        league.setCodePrefix(dto.getCodePrefix());
        return league;
    }

    public static List<LeagueDto> fromEntityList(List<League> leagues) {
        if (leagues == null) {
            return null;
        }
        return leagues.stream()
                .map(LeagueDto::fromEntity)
                .collect(Collectors.toList());
    }

    public static List<League> toEntityList(List<LeagueDto> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(LeagueDto::toEntity)
                .collect(Collectors.toList());
    }
}
