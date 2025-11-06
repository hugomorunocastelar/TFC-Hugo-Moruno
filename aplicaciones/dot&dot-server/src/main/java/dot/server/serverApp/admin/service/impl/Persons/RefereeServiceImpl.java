package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.CoachService;
import dot.server.serverApp.admin.service.RefereeService;
import dot.server.serverApp.model.Person.dao.CoachDao;
import dot.server.serverApp.model.Person.dao.RefereeDao;
import dot.server.serverApp.model.Person.entity.Coach;
import dot.server.serverApp.model.Person.entity.Referee;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefereeServiceImpl implements RefereeService {

    private final RefereeDao refereeDao;

    @Autowired
    public RefereeServiceImpl(RefereeDao refereeDao) {
        this.refereeDao = refereeDao;
    }

    @Override
    public Referee save(Referee referee) {
        return refereeDao.save(referee);
    }

    @Override
    public Referee findById(Long id) {
        return refereeDao.findById(id).orElse(null);
    }

    @Override
    public List<Referee> findAll() {
        return refereeDao.findAll();
    }

    @Override
    public Referee update(Long id, Referee referee) {
        return refereeDao.findById(id)
                .map(existing -> {
                    existing.setNoLicense(referee.getNoLicense());
                    existing.setLvlLicense(referee.getLvlLicense());
                    existing.setCity(referee.getCity());
                    existing.setDni(referee.getDni());
                    return refereeDao.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Referee not found with id " + id));
    }

    @Override
    public void deleteById(Long id) {
        refereeDao.deleteById(id);
    }
}
