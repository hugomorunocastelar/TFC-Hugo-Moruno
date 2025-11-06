package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.CompetitionService;
import dot.server.serverApp.model.MatchDefinitions.dao.CompetitionDao;
import dot.server.serverApp.model.MatchDefinitions.dto.CompetitionDto;
import dot.server.serverApp.model.MatchDefinitions.entity.Competition;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompetitionServiceImpl implements CompetitionService {

    private final CompetitionDao competitionDao;

    public CompetitionServiceImpl(CompetitionDao competitionDao) {
        this.competitionDao = competitionDao;
    }

    @Override
    public CompetitionDto createCompetition(CompetitionDto competitionDto) {
        Competition competition = CompetitionDto.to(competitionDto);
        Competition saved = competitionDao.save(competition);
        return CompetitionDto.from(saved);
    }

    @Override
    public Optional<CompetitionDto> getCompetitionById(Long id) {
        return competitionDao.findById(id).map(CompetitionDto::from);
    }

    @Override
    public List<CompetitionDto> getAllCompetitions() {
        List<Competition> competitions = competitionDao.findAll();
        return CompetitionDto.from(competitions);
    }

    @Override
    public CompetitionDto updateCompetition(Long id, CompetitionDto competitionDto) {
        return competitionDao.findById(id).map(existing -> {
            existing.setName(competitionDto.getName());
            existing.setDayStart(competitionDto.getDayStart());
            existing.setDayEnd(competitionDto.getDayEnd());
            Competition updated = competitionDao.save(existing);
            return CompetitionDto.from(updated);
        }).orElseThrow(() -> new RuntimeException("Competition not found with id " + id));
    }

    @Override
    public void deleteCompetition(Long id) {
        competitionDao.deleteById(id);
    }
}
