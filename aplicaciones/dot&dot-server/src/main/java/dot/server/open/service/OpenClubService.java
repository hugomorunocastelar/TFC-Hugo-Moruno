package dot.server.open.service;


import dot.server.data.Club.entity.Club;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OpenClubService {
    Club findById(Long id);

    List<Club> findAll();
}
