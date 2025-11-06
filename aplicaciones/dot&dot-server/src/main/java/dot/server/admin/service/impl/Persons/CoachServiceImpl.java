package dot.server.admin.service.impl.Persons;

import dot.server.admin.service.Persons.CoachService;
import dot.server.resources.Club.dao.TeamDao;
import dot.server.resources.Club.dto.TeamDto;
import dot.server.resources.Club.entity.Team;
import dot.server.resources.Person.dao.CoachDao;
import dot.server.resources.Person.dao.PersonDao;
import dot.server.resources.Person.dto.CoachDTO;
import dot.server.resources.Person.dto.PersonDTO;
import dot.server.resources.Person.entity.Coach;
import dot.server.resources.Person.entity.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static dot.server.resources.Person.dto.CoachDTO.from;
import static dot.server.resources.Person.dto.CoachDTO.to;

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
        if (dto == null || dto.getNoLicense() == null || dto.getDni() == null) {
            return false;
        }

        if (dto.getTeam() != null && dto.getTeam().getId() != 0) {
            Team team = teamDao.findById(dto.getTeam().getId()).orElse(null);
            assert team != null;
            dto.setTeam(TeamDto.from(team));
        }

        if (dto.getDni() != null && dto.getDni().getId() != 0) {
            Person person = personDao.findById(dto.getDni().getId()).orElse(null);
            assert person != null;
            dto.setDni(PersonDTO.from(person));
        }

        Coach coach = to(dto);
        coachDao.save(coach);
        return true;
    }

    @Override
    public boolean update(CoachDTO dto) {
        if (dto == null || dto.getId() == null) return false;

        Optional<Coach> coachOpt = coachDao.findById(dto.getId());
        if (coachOpt.isEmpty()) return false;

        Coach existing = coachOpt.get();
        existing.setNoLicense(dto.getNoLicense());
        existing.setLvlLicense(dto.getLvlLicense());

        if (dto.getTeam() != null && dto.getTeam().getId() != 0) {
            teamDao.findById(dto.getTeam().getId()).ifPresent(existing::setTeam);
        }
        if (dto.getDni() != null && dto.getDni().getId() != 0) {
            personDao.findById(dto.getDni().getId()).ifPresent(existing::setDni);
        }

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
