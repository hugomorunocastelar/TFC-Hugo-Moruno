package dot.server.data.Person.dto;

import dot.server.data.Club.dto.TeamDto;
import dot.server.data.Person.entity.Coach;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class CoachDTO {

    private Long id;
    private String noLicense;
    private String lvlLicense;

    private TeamDto team;
    private PersonDTO dni;

    public static CoachDTO from(Coach coach) {
        if (coach == null) return null;

        CoachDTO dto = new CoachDTO();
        dto.setId(coach.getId());
        dto.setNoLicense(coach.getNoLicense());
        dto.setLvlLicense(coach.getLvlLicense());
        dto.setTeam(TeamDto.from(coach.getTeam()));
        dto.setDni(PersonDTO.from(coach.getDni()));
        return dto;
    }

    public static Coach to(CoachDTO dto) {
        if (dto == null) return null;

        Coach coach = new Coach();
        if (dto.getId() != null) {
            coach.setId(dto.getId());
        }
        coach.setNoLicense(dto.getNoLicense());
        coach.setLvlLicense(dto.getLvlLicense());
        coach.setTeam(TeamDto.to(dto.getTeam()));
        coach.setDni(PersonDTO.to(dto.getDni()));
        return coach;
    }

    public static List<CoachDTO> from(List<Coach> list) {
        return list.stream().map(CoachDTO::from).collect(Collectors.toList());
    }

    public static List<Coach> to(List<CoachDTO> dtoList) {
        return dtoList.stream().map(CoachDTO::to).collect(Collectors.toList());
    }
}
