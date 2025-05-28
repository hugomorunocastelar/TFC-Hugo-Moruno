package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.CoachService;
import dot.server.serverApp.model.Person.dao.CoachDao;
import dot.server.serverApp.model.Person.entity.Coach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoachServiceImpl implements CoachService {

    private final CoachDao coachDao;

    @Autowired
    public CoachServiceImpl(CoachDao coachDao) {
        this.coachDao = coachDao;
    }

    @Override
    public Coach save(Coach coach) {
        return coachDao.save(coach);
    }

    @Override
    public Coach findById(Long id) {
        return coachDao.findById(id).orElse(null);
    }

    @Override
    public List<Coach> findAll() {
        return coachDao.findAll();
    }

    @Override
    public Coach update(Long id, Coach coach) {
        return coachDao.findById(id)
                .map(existing -> {
                    existing.setNoLicense(coach.getNoLicense());
                    existing.setLvlLicense(coach.getLvlLicense());
                    existing.setTeam(coach.getTeam());
                    existing.setDni(coach.getDni());
                    return coachDao.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Coach not found"));
    }

    @Override
    public void deleteById(Long id) {
        coachDao.deleteById(id);
    }
}
