package dot.server.data.Person.dto;

import dot.server.data.MatchDefinitions.dto.CityDto;
import dot.server.data.Person.entity.Referee;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class RefereeDTO {

    private Long id;
    private String noLicense;
    private String lvlLicense;

    private CityDto city;
    private PersonDTO dni;

    public static RefereeDTO from(Referee referee) {
        if (referee == null) return null;

        RefereeDTO dto = new RefereeDTO();
        dto.setId(referee.getId());
        dto.setNoLicense(referee.getNoLicense());
        dto.setLvlLicense(referee.getLvlLicense());
        dto.setCity(CityDto.from(referee.getCity()));
        dto.setDni(PersonDTO.from(referee.getDni()));
        return dto;
    }

    public static Referee to(RefereeDTO dto) {
        if (dto == null) return null;

        Referee referee = new Referee();
        if (dto.getId() != null) {
            referee.setId(dto.getId());
        }
        referee.setNoLicense(dto.getNoLicense());
        referee.setLvlLicense(dto.getLvlLicense());
        referee.setCity(CityDto.to(dto.getCity()));
        referee.setDni(PersonDTO.to(dto.getDni()));
        return referee;
    }

    public static List<RefereeDTO> from(List<Referee> list) {
        if (list == null) return null;
        return list.stream().map(RefereeDTO::from).collect(Collectors.toList());
    }

    public static List<Referee> to(List<RefereeDTO> dtoList) {
        if (dtoList == null) return null;
        return dtoList.stream().map(RefereeDTO::to).collect(Collectors.toList());
    }
}
