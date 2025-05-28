package dot.server.serverApp.admin.service;

import dot.server.serverApp.model.Person.entity.Coach;
import dot.server.serverApp.model.Person.entity.Referee;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RefereeService {

    Referee save(Referee referee);
    Referee findById(Long id);
    List<Referee> findAll();
    Referee update(Long id, Referee referee);
    void deleteById(Long id);
}
