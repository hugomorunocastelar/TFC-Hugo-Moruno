package dot.server.serverApp.model.Person.dto;

import dot.server.serverApp.model.Person.entity.Coach;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class CoachDTO {

    private Long id;
    private String noLicense;
    private String lvlLicense;

    private Long teamId;
    private Long personId;

    public static CoachDTO from(Coach coach) {
        if (coach == null) return null;

        CoachDTO dto = new CoachDTO();
        dto.setId(coach.getId());
        dto.setNoLicense(coach.getNoLicense());
        dto.setLvlLicense(coach.getLvlLicense());
        dto.setTeamId(coach.getTeam() != null ? coach.getTeam().getId() : null);
        dto.setPersonId(coach.getDni() != null ? coach.getDni().getId() : null);
        return dto;
    }

    public static Coach to(CoachDTO dto) {
        if (dto == null) return null;

        Coach coach = new Coach();
        coach.setId(dto.getId());
        coach.setNoLicense(dto.getNoLicense());
        coach.setLvlLicense(dto.getLvlLicense());

        if (dto.getTeamId() != null) {
            var team = new dot.server.serverApp.model.Club.entity.Team();
            team.setId(dto.getTeamId());
            coach.setTeam(team);
        }

        if (dto.getPersonId() != null) {
            var person = new dot.server.serverApp.model.Person.entity.Person();
            person.setId(dto.getPersonId());
            coach.setDni(person);
        }

        return coach;
    }

    public static List<CoachDTO> from(List<Coach> list) {
        return list.stream().map(CoachDTO::from).collect(Collectors.toList());
    }

    public static List<Coach> to(List<CoachDTO> dtoList) {
        return dtoList.stream().map(CoachDTO::to).collect(Collectors.toList());
    }
}
