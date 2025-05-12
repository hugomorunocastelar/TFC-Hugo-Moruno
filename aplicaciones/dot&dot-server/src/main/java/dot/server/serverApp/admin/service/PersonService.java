package dot.server.serverApp.admin.service;

import dot.server.serverApp.model.Person.dto.PersonDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PersonService {

    public List<PersonDTO> list();


}
