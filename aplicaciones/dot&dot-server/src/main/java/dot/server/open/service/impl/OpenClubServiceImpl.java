package dot.server.open.service.impl;

import dot.server.open.service.OpenClubService;
import dot.server.resources.Club.dao.ClubDao;
import dot.server.resources.Club.entity.Club;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OpenClubServiceImpl implements OpenClubService {

    private final ClubDao clubDao;

    @Autowired
    public OpenClubServiceImpl(ClubDao clubDao) {
        this.clubDao = clubDao;
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

}
