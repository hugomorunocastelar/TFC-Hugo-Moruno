package dot.server.admin.service.impl.Definitions;

import dot.server.admin.service.Definitions.LeagueService;
import dot.server.data.MatchDefinitions.dao.LeagueDao;
import dot.server.data.MatchDefinitions.dto.LeagueDto;
import dot.server.data.MatchDefinitions.entity.League;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeagueServiceImpl implements LeagueService {

    private final LeagueDao leagueDao;

    public LeagueServiceImpl(LeagueDao leagueDao) {
        this.leagueDao = leagueDao;
    }

    @Override
    public LeagueDto save(LeagueDto leagueDto) {
        League league = LeagueDto.to(leagueDto);
        League saved = leagueDao.save(league);
        return LeagueDto.from(saved);
    }

    @Override
    public LeagueDto findById(Long id) {
        return leagueDao.findById(id)
                .map(LeagueDto::from)
                .orElse(null);
    }

    @Override
    public List<LeagueDto> findAll() {
        return LeagueDto.from(leagueDao.findAll());
    }

    @Override
    public void deleteById(Long id) {
        leagueDao.deleteById(id);
    }
}
