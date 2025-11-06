package dot.server.admin.service.Persons;

import dot.server.resources.Person.dto.PersonDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PersonService {

    public List<PersonDTO> list();

    PersonDTO findById(Long id);

    boolean create(PersonDTO p);

    boolean update(PersonDTO p);

    boolean delete(PersonDTO p);
}
