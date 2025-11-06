package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.CoachService;
import dot.server.serverApp.model.Club.dao.TeamDao;
import dot.server.serverApp.model.Club.entity.Team;
import dot.server.serverApp.model.Person.dao.CoachDao;
import dot.server.serverApp.model.Person.dao.PersonDao;
import dot.server.serverApp.model.Person.dto.CoachDTO;
import dot.server.serverApp.model.Person.entity.Coach;
import dot.server.serverApp.model.Person.entity.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static dot.server.serverApp.model.Person.dto.CoachDTO.from;
import static dot.server.serverApp.model.Person.dto.CoachDTO.to;

@Service
public class CoachServiceImpl implements CoachService {

    private final CoachDao coachDao;
    private final TeamDao teamDao;
    private final PersonDao personDao;

    @Autowired
    public CoachServiceImpl(CoachDao coachDao, TeamDao teamDao, PersonDao personDao) {
        this.coachDao = coachDao;
        this.teamDao = teamDao;
        this.personDao = personDao;
    }

    @Override
    public List<CoachDTO> list() {
        return from(coachDao.findAll());
    }

    @Override
    public CoachDTO findById(Long id) {
        return coachDao.findById(id)
                .map(CoachDTO::from)
                .orElse(null);
    }

    @Override
    public boolean create(CoachDTO dto) {
        if (dto == null || dto.getNoLicense() == null || dto.getPersonId() == null) {
            return false;
        }

        Optional<Team> teamOpt = teamDao.findById(dto.getTeamId());
        Optional<Person> personOpt = personDao.findById(dto.getPersonId());

        if (personOpt.isEmpty()) return false;

        Coach coach = to(dto);
        teamOpt.ifPresent(coach::setTeam);
        coach.setDni(personOpt.get());

        coachDao.save(coach);
        return true;
    }

    @Override
    public boolean update(CoachDTO dto) {
        if (dto == null || dto.getId() == 0) return false;

        Optional<Coach> coachOpt = coachDao.findById(dto.getId());
        if (coachOpt.isEmpty()) return false;

        Coach existing = coachOpt.get();
        existing.setNoLicense(dto.getNoLicense());
        existing.setLvlLicense(dto.getLvlLicense());

        teamDao.findById(dto.getTeamId()).ifPresent(existing::setTeam);
        personDao.findById(dto.getPersonId()).ifPresent(existing::setDni);

        coachDao.save(existing);
        return true;
    }

    @Override
    public boolean delete(Long id) {
        if (coachDao.existsById(id)) {
            coachDao.deleteById(id);
            return true;
        }
        return false;
    }
}
