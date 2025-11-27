package dot.server.admin.service.Persons;

import dot.server.data.Person.dto.RefereeDTO;

import java.util.List;
import java.util.Optional;

public interface RefereeService {

    List<RefereeDTO> findAll();

    Optional<RefereeDTO> findById(Long id);

    RefereeDTO save(RefereeDTO refereeDTO);

    RefereeDTO update(Long id, RefereeDTO refereeDTO);

    void deleteById(Long id);
}
