package dot.server.resources.Person.dto;

import dot.server.resources.Club.dto.TeamDto;
import dot.server.resources.Person.entity.Player;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class PlayerDTO {

    private Long id;
    private Integer noShirt;

    private TeamDto team;
    private PersonDTO dni;

    public static PlayerDTO from(Player player) {
        if (player == null) return null;

        PlayerDTO dto = new PlayerDTO();
        dto.setId(player.getId());
        dto.setNoShirt(player.getNoShirt());
        dto.setTeam(TeamDto.from(player.getTeam()));
        dto.setDni(PersonDTO.from(player.getDni()));
        return dto;
    }

    public static Player to(PlayerDTO dto) {
        if (dto == null) return null;

        Player player = new Player();
        if (dto.getId() != null) {
            player.setId(dto.getId());
        }
        player.setNoShirt(dto.getNoShirt());
        player.setTeam(TeamDto.to(dto.getTeam()));
        player.setDni(PersonDTO.to(dto.getDni()));
        return player;
    }

    public static List<PlayerDTO> from(List<Player> list) {
        if (list == null) return null;
        return list.stream().map(PlayerDTO::from).collect(Collectors.toList());
    }

    public static List<Player> to(List<PlayerDTO> dtoList) {
        if (dtoList == null) return null;
        return dtoList.stream().map(PlayerDTO::to).collect(Collectors.toList());
    }
}
