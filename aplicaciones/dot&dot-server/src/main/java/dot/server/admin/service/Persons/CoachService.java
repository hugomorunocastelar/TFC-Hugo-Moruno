package dot.server.admin.service.Persons;

import dot.server.resources.Person.dto.CoachDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CoachService {

    boolean create(CoachDTO dto);

    CoachDTO findById(Long id);

    List<CoachDTO> list();

    boolean update(CoachDTO dto);

    boolean delete(Long id);
}
