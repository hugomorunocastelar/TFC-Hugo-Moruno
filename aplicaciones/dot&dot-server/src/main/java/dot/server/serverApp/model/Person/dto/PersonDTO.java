package dot.server.serverApp.model.Person.dto;

import dot.server.serverApp.model.Person.entity.Person;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class PersonDTO {
    private long id;
    private String dni;
    private String name;
    private String surnames;
    private Date birthDate;
    private String address;
    private String phone;
    private String email;
    private Boolean dniVerified;
    private Boolean tutored;
    private Long tutorId;

    public static PersonDTO from(Person person) {
        PersonDTO dto = new PersonDTO();
        dto.setId(person.getId());
        dto.setDni(person.getDni());
        dto.setName(person.getName());
        dto.setSurnames(person.getSurnames());
        dto.setBirthDate(person.getBirthDate());
        dto.setAddress(person.getAddress());
        dto.setPhone(person.getPhone());
        dto.setEmail(person.getEmail());
        dto.setDniVerified(person.getDniVerified());
        dto.setTutored(person.getTutored());
        dto.setTutorId(person.getTutor() != null ? person.getTutor().getId() : null);
        return dto;
    }

    public static Person to(PersonDTO dto) {
        Person person = new Person();
        person.setId(dto.getId());
        person.setDni(dto.getDni());
        person.setName(dto.getName());
        person.setSurnames(dto.getSurnames());
        person.setBirthDate(dto.getBirthDate());
        person.setAddress(dto.getAddress());
        person.setPhone(dto.getPhone());
        person.setEmail(dto.getEmail());
        person.setDniVerified(dto.getDniVerified());
        person.setTutored(dto.getTutored());
        return person;
    }

    public static List<PersonDTO> from(List<Person> people) {
        return people.stream().map(PersonDTO::from).collect(Collectors.toList());
    }

    public static List<Person> to(List<PersonDTO> dtoList) {
        return dtoList.stream().map(PersonDTO::to).collect(Collectors.toList());
    }
}
