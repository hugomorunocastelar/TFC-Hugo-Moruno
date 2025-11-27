package dot.server.data.Club.dto;

import dot.server.data.Club.entity.Team;
import dot.server.data.Definitions.Category;
import dot.server.data.Person.dto.PersonDTO;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class TeamDto {
    private Long id;
    private String name;
    private PersonDTO dniCaptain;
    private ClubDto idClub;
    private Category category;

    public static TeamDto from(Team team) {
        if (team == null) return null;

        TeamDto dto = new TeamDto();
        dto.setId(team.getId());
        dto.setName(team.getName());
        if (team.getDniCaptain() != null) {
            dto.setDniCaptain(PersonDTO.from(team.getDniCaptain()));
        }
        if (team.getIdClub() != null) {
            dto.setIdClub(ClubDto.from(team.getIdClub()));
        }
        dto.setCategory(team.getCategory());
        return dto;
    }

    public static Team to(TeamDto dto) {
        if (dto == null) return null;

        Team team = new Team();
        if (dto.getId() != null) {
            team.setId(dto.getId());
        }
        team.setName(dto.getName());
        team.setCategory(dto.getCategory());
        return team;
    }

    public static List<TeamDto> from(List<Team> teams) {
        if (teams == null) return null;
        return teams.stream()
                .map(TeamDto::from)
                .collect(Collectors.toList());
    }

    public static List<Team> to(List<TeamDto> dtos) {
        if (dtos == null) return null;
        return dtos.stream()
                .map(TeamDto::to)
                .collect(Collectors.toList());
    }
}
