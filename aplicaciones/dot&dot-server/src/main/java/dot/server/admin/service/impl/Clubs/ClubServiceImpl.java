package dot.server.admin.service.impl.Clubs;

import dot.server.admin.service.Clubs.ClubService;
import dot.server.resources.Club.dao.ClubDao;
import dot.server.resources.Club.entity.Club;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ClubServiceImpl implements ClubService {

    private final ClubDao clubDao;

    @Autowired
    public ClubServiceImpl(ClubDao clubDao) {
        this.clubDao = clubDao;
    }

    @Override
    public Club create(Club club) {
        return clubDao.save(club);
    }

    @Override
    public Club findById(Long id) {
        return clubDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found with id " + id));
    }

    @Override
    public List<Club> findAll() {
        return clubDao.findAll();
    }

    @Override
    public Club update(Long id, Club club) {
        Club existingClub = clubDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Club not found with id " + id));

        existingClub.setName(club.getName());
        existingClub.setIdCity(club.getIdCity());

        return clubDao.save(existingClub);
    }

    @Override
    public void delete(Long id) {
        if (!clubDao.existsById(id)) {
            throw new RuntimeException("Club not found with id " + id);
        }
        clubDao.deleteById(id);
    }
}
