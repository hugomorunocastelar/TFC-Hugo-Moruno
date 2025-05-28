package dot.server.serverApp.admin.controller;

import dot.server.serverApp.admin.service.PersonService;
import dot.server.serverApp.model.Person.dto.PersonDTO;
import dot.server.serverApp.model.Person.entity.Person;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/person")
@CrossOrigin("*")
public class PersonController {

    @Autowired
    PersonService serv;

    @GetMapping("")
    public ResponseEntity<?> getAll() {
        List<PersonDTO> response = serv.list();
        if (response != null) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.internalServerError().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> find(
        @PathVariable("id") Long id
    ) {
        PersonDTO p = serv.findById(id);
        if (p != null)
            return ResponseEntity.ok(p);
        else
            return ResponseEntity.badRequest().build();
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(
        @RequestBody PersonDTO person
    ) {
        if (serv.create(person))
            return ResponseEntity.ok(person);
        else
            return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}/update")
    public ResponseEntity<?> update(
        @RequestBody PersonDTO person
    ) {
        if(serv.update(person))
            return ResponseEntity.ok(person);
        else
            return ResponseEntity.badRequest().build();
    }

}
