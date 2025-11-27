package dot.server.admin.service.Persons;

import dot.server.data.Person.dto.PlayerDTO;

import java.util.List;
import java.util.Optional;

public interface PlayerService {

    List<PlayerDTO> findAll();

    Optional<PlayerDTO> findById(Long id);

    PlayerDTO save(PlayerDTO playerDTO);

    PlayerDTO update(Long id, PlayerDTO playerDTO);

    void deleteById(Long id);
}
