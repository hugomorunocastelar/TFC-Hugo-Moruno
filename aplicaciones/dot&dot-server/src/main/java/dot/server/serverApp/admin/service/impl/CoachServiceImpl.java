package dot.server.serverApp.admin.service;

import dot.server.serverApp.model.Person.dto.PersonDTO;
import dot.server.serverApp.model.Person.entity.Coach;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CoachService {

    Coach save(Coach coach);
    Coach findById(Long id);
    List<Coach> findAll();
    Coach update(Long id, Coach coach);
    void deleteById(Long id);
}
