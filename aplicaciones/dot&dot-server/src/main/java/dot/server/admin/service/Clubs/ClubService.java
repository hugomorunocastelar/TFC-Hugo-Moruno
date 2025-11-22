package dot.server.admin.service.Clubs;


import dot.server.resources.Club.entity.Club;
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
