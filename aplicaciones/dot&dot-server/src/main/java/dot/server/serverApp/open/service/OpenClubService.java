package dot.server.serverApp.open.service;


import dot.server.serverApp.model.Club.entity.Club;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface OpenClubService {
    Club findById(Long id);
    List<Club> findAll();
}
