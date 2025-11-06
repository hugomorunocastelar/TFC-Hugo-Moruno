package dot.server.serverApp.admin.service.impl.Definitions;

import dot.server.serverApp.admin.service.Definitions.SeasonService;
import dot.server.serverApp.model.MatchDefinitions.dao.SeasonDao;
import dot.server.serverApp.model.MatchDefinitions.dto.SeasonDto;
import dot.server.serverApp.model.MatchDefinitions.entity.Season;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SeasonServiceImpl implements SeasonService {

    private final SeasonDao seasonDao;

    public SeasonServiceImpl(SeasonDao seasonDao) {
        this.seasonDao = seasonDao;
    }

    @Override
    public List<SeasonDto> findAll() {
        List<Season> seasons = seasonDao.findAll();
        return seasons.stream()
                .map(SeasonDto::from)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<SeasonDto> findById(Long id) {
        return seasonDao.findById(id)
                .map(SeasonDto::from);
    }

    @Override
    public SeasonDto save(SeasonDto seasonDto) {
        Season season = SeasonDto.to(seasonDto);
        Season saved = seasonDao.save(season);
        return SeasonDto.from(saved);
    }

    @Override
    public SeasonDto update(Long id, SeasonDto seasonDto) {
        return seasonDao.findById(id)
                .map(existingSeason -> {
                    existingSeason.setName(seasonDto.getName());
                    existingSeason.setInitialDay(seasonDto.getInitialDay());
                    existingSeason.setFinalisationDay(seasonDto.getFinalisationDay());
                    Season updated = seasonDao.save(existingSeason);
                    return SeasonDto.from(updated);
                })
                .orElseThrow(() -> new RuntimeException("Season not found with id " + id));
    }

    @Override
    public void deleteById(Long id) {
        seasonDao.deleteById(id);
    }
}
