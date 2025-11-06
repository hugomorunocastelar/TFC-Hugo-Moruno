package dot.server.admin.controller.Persons;

import dot.server.admin.service.Persons.PersonService;
import dot.server.resources.Person.dto.PersonDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/person")
@CrossOrigin("*")
@Tag(name = "Admin - Personas", description = "CRUD para gestión de personas")
public class PersonController {

    @Autowired
    private PersonService serv;

    @GetMapping
    @Operation(summary = "Obtener todas las personas")
    public ResponseEntity<List<PersonDTO>> getAll() {
        List<PersonDTO> response = serv.list();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener persona por ID")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        return ResponseEntity.ok(PersonDTO.to(serv.findById(id)));
    }

    @PostMapping
    @Operation(summary = "Crear una nueva persona")
    public ResponseEntity<PersonDTO> create(@Valid @RequestBody PersonDTO person) {
        boolean created = serv.create(person);
        if (created) {
            return ResponseEntity.status(201).body(person);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar persona existente")
    public ResponseEntity<PersonDTO> update(@PathVariable Long id, @Valid @RequestBody PersonDTO person) {
        person.setId(id);
        boolean updated = serv.update(person);
        if (updated) {
            return ResponseEntity.ok(person);
        }
        return ResponseEntity.notFound().build();
    }
}
