package dot.server.serverApp.admin.service.impl;

import dot.server.serverApp.admin.service.PersonService;
import dot.server.serverApp.model.Person.dao.PersonDAO;
import dot.server.serverApp.model.Person.dto.PersonDTO;
import dot.server.serverApp.model.Person.entity.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
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

    @Override
    public PersonDTO findById(Long id) {

        Person p = dao.findById(id).orElse(null);
        if (p != null)
            return PersonDTO.from(p);
        else
            return null;
    }

    @Override
    public boolean create(PersonDTO p) {
        Person person = PersonDTO.to(p);
        if (!person.equals(new PersonDTO())) {
            dao.save(person);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public boolean update(PersonDTO p) {
        Person person = PersonDTO.to(p);
        Person found = dao.findById(p.getId()).orElse(null);
        if(!person.equals(found)) {
            dao.save(person);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public boolean delete(PersonDTO p) {
        try {
            if (dao.existsById(p.getId()))
                dao.deleteById(p.getId());
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
