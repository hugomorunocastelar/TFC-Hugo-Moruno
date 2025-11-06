package dot.server.serverApp.admin.service.impl.Persons;

import dot.server.serverApp.admin.service.Persons.PlayerService;
import dot.server.serverApp.model.Club.dto.TeamDto;
import dot.server.serverApp.model.Person.dao.PlayerDao;
import dot.server.serverApp.model.Person.dto.PersonDTO;
import dot.server.serverApp.model.Person.dto.PlayerDTO;
import dot.server.serverApp.model.Person.entity.Player;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerServiceImpl implements PlayerService {

    private final PlayerDao playerDao;

    public PlayerServiceImpl(PlayerDao playerDao) {
        this.playerDao = playerDao;
    }

    @Override
    public List<PlayerDTO> findAll() {
        List<Player> players = playerDao.findAll();
        return PlayerDTO.from(players);
    }

    @Override
    public Optional<PlayerDTO> findById(Long id) {
        return playerDao.findById(id)
                .map(PlayerDTO::from);
    }

    @Override
    public PlayerDTO save(PlayerDTO playerDTO) {
        Player player = PlayerDTO.to(playerDTO);
        Player saved = playerDao.save(player);
        return PlayerDTO.from(saved);
    }

    @Override
    public PlayerDTO update(Long id, PlayerDTO playerDTO) {
        return playerDao.findById(id)
                .map(existingPlayer -> {
                    existingPlayer.setNoShirt(playerDTO.getNoShirt());
                    existingPlayer.setTeam(TeamDto.to(playerDTO.getTeam()));
                    existingPlayer.setDni(PersonDTO.to(playerDTO.getDni()));
                    Player updated = playerDao.save(existingPlayer);
                    return PlayerDTO.from(updated);
                })
                .orElseThrow(() -> new RuntimeException("Player not found with id " + id));
    }

    @Override
    public void deleteById(Long id) {
        playerDao.deleteById(id);
    }
}
