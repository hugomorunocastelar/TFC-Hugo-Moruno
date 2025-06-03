package dot.server.serverApp.open.service.impl;

import dot.server.serverApp.model.MatchDefinitions.dao.LeagueDao;
import dot.server.serverApp.model.MatchDefinitions.entity.League;
import dot.server.serverApp.open.service.OpenLeagueService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpenLeagueServiceImpl implements OpenLeagueService {

    private final LeagueDao leagueDao;
    public OpenLeagueServiceImpl(LeagueDao leagueDao) {
        this.leagueDao = leagueDao;
    }

    @Override
    public League findById(Long id) {
        return leagueDao.findById(id).orElse(null);
    }

    @Override
    public List<League> findAll() {
        return leagueDao.findAll();
    }
}
