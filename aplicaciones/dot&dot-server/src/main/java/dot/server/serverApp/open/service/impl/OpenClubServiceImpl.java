package dot.server.serverApp.open.service.impl;

import dot.server.serverApp.model.Club.dao.ClubDao;
import dot.server.serverApp.model.Club.entity.Club;
import dot.server.serverApp.open.service.OpenClubService;
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
