package dot.server.serverApp.admin.service;


import dot.server.serverApp.model.Club.entity.Club;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ClubService {
    Club create(Club club);
    Club findById(Long id);
    List<Club> findAll();
    Club update(Long id, Club club);
    void delete(Long id);
}
