package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.LeagueService;
import dot.server.serverApp.model.MatchDefinitions.dao.LeagueDao;
import dot.server.serverApp.model.MatchDefinitions.dto.LeagueDto;
import dot.server.serverApp.model.MatchDefinitions.entity.League;
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
