package dot.server.open.service.impl;

import dot.server.open.service.OpenCompetitionService;
import dot.server.data.MatchDefinitions.dao.CompetitionDao;
import dot.server.data.MatchDefinitions.entity.Competition;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpenCompetitionServiceImpl implements OpenCompetitionService {

    private final CompetitionDao competitionDao;

    public OpenCompetitionServiceImpl(CompetitionDao competitionDao) {
        this.competitionDao = competitionDao;
    }

    @Override
    public Competition findById(Long id) {
        return competitionDao.findById(id).orElse(null);
    }

    @Override
    public List<Competition> findAll() {
        return competitionDao.findAll();
    }
}
