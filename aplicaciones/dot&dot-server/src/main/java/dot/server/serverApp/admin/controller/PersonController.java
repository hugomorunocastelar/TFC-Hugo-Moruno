package dot.server.serverApp.admin.controller;

import dot.server.serverApp.admin.service.PersonService;
import dot.server.serverApp.model.Person.dto.PersonDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
