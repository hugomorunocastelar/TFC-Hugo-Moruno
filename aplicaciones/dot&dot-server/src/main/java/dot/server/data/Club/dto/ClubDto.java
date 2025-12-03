package dot.server.data.Club.dto;

import dot.server.data.Club.entity.Club;
import dot.server.data.MatchDefinitions.dto.CityDto;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class ClubDto {
    private long id;
    private String name;
    private CityDto idCity;
    private ClubContactDto contact;

    public static ClubDto from(Club club) {
        if (club == null) return null;

        ClubDto dto = new ClubDto();
        dto.setId(club.getId());
        dto.setName(club.getName());
        dto.setIdCity(CityDto.from(club.getIdCity()));
        dto.setContact(ClubContactDto.from(club.getContact()));
        return dto;
    }

    public static Club to(ClubDto dto) {
        if (dto == null) return null;

        Club club = new Club();
        if (dto.getId() != 0) {
            club.setId(dto.getId());
        }
        club.setName(dto.getName());
        club.setIdCity(dto.getIdCity() != null ? CityDto.to(dto.getIdCity()) : null);
        club.setContact(ClubContactDto.to(dto.getContact()));
        return club;
    }

    public static List<ClubDto> from(List<Club> clubs) {
        if (clubs == null) return null;
        return clubs.stream().map(ClubDto::from).collect(Collectors.toList());
    }

    public static List<Club> to(List<ClubDto> dtos) {
        if (dtos == null) return null;
        return dtos.stream().map(ClubDto::to).collect(Collectors.toList());
    }
}
