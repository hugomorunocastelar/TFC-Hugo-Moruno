package dot.server.admin.service.impl.Persons;

import dot.server.admin.service.Persons.PersonService;
import dot.server.data.Person.dao.PersonDao;
import dot.server.data.Person.dto.PersonDTO;
import dot.server.data.Person.entity.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PersonServiceImpl implements PersonService {

    private final PersonDao dao;

    @Autowired
    public PersonServiceImpl(PersonDao dao) {
        this.dao = dao;
    }

    @Override
    public List<PersonDTO> list() {
        List<Person> persons = dao.findAll();
        return PersonDTO.from(persons);
    }

    @Override
    public PersonDTO findById(Long id) {
        return dao.findById(id)
                .map(PersonDTO::from)
                .orElse(null);
    }

    @Override
    public boolean create(PersonDTO dto) {
        if (dto == null || dto.getDni() == null || dto.getDni().isEmpty()) {
            return false;
        }

        boolean exists = dao.findByDni(dto.getDni()).isPresent();
        if (exists) return false;

        Person person = PersonDTO.to(dto);
        dao.save(person);
        return true;
    }

    @Override
    public boolean update(PersonDTO dto) {
        if (dto == null || dto.getId() == 0) return false;

        Optional<Person> existingOpt = dao.findById(dto.getId());
        if (existingOpt.isEmpty()) return false;

        Person updated = PersonDTO.to(dto);
        dao.save(updated);
        return true;
    }

    @Override
    public boolean delete(PersonDTO dto) {
        if (dto == null || dto.getId() == 0) return false;

        if (!dao.existsById(dto.getId())) return false;

        dao.deleteById(dto.getId());
        return true;
    }
}
