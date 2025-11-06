package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.GameplacesService;
import dot.server.serverApp.model.MatchDefinitions.dao.GameplaceDao;
import dot.server.serverApp.model.MatchDefinitions.dto.GameplaceDto;
import dot.server.serverApp.model.MatchDefinitions.entity.Gameplace;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameplacesServiceImpl implements GameplacesService {

    private final GameplaceDao gameplaceDao;

    public GameplacesServiceImpl(GameplaceDao gameplaceDao) {
        this.gameplaceDao = gameplaceDao;
    }

    @Override
    public GameplaceDto createGameplace(GameplaceDto gameplaceDto) {
        Gameplace gameplace = GameplaceDto.to(gameplaceDto);
        Gameplace saved = gameplaceDao.save(gameplace);
        return GameplaceDto.from(saved);
    }

    @Override
    public Optional<GameplaceDto> getGameplaceById(Long id) {
        return gameplaceDao.findById(id).map(GameplaceDto::from);
    }

    @Override
    public List<GameplaceDto> getAllGameplaces() {
        List<Gameplace> gameplaces = gameplaceDao.findAll();
        return GameplaceDto.from(gameplaces);
    }

    @Override
    public GameplaceDto updateGameplace(Long id, GameplaceDto gameplaceDto) {
        return gameplaceDao.findById(id).map(existing -> {
            existing.setName(gameplaceDto.getName());
            existing.setGamefields(gameplaceDto.getGamefields());
            existing.setAddress(gameplaceDto.getAddress());
            existing.setIdCity(gameplaceDto.getIdCity() != null ?
                    dot.server.serverApp.model.MatchDefinitions.dto.CityDto.to(gameplaceDto.getIdCity()) : null);
            Gameplace updated = gameplaceDao.save(existing);
            return GameplaceDto.from(updated);
        }).orElseThrow(() -> new RuntimeException("Gameplace not found with id " + id));
    }

    @Override
    public void deleteGameplace(Long id) {
        gameplaceDao.deleteById(id);
    }
}
