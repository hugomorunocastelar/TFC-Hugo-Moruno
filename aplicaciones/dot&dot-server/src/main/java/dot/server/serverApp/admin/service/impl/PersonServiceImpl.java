package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.PersonService;
import dot.server.serverApp.model.Person.dao.PersonDAO;
import dot.server.serverApp.model.Person.dto.PersonDTO;
import dot.server.serverApp.model.Person.entity.Person;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class PersonServiceImpl implements PersonService {

    @Autowired
    PersonDAO dao;

    @Override
    public List<PersonDTO> list() {
        List<Person> persons = dao.findAll();
        List<PersonDTO> response = null;
        if (!persons.isEmpty()) {
            response = PersonDTO.from(persons);
        }
        return response;
    }
}
