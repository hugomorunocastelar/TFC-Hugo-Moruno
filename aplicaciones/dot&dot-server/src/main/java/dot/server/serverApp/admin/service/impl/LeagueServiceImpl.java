package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.LeagueService;
import dot.server.serverApp.model.MatchDefinitions.dao.LeagueDao;
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
    public League save(League league) {
        return leagueDao.save(league);
    }

    @Override
    public League findById(Long id) {
        return leagueDao.findById(id).orElse(null);
    }

    @Override
    public List<League> findAll() {
        return leagueDao.findAll();
    }

    @Override
    public void deleteById(Long id) {
        leagueDao.deleteById(id);
    }
}
