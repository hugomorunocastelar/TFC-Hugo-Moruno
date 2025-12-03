package dot.server.admin.controller.Persons;

import dot.server.admin.service.Persons.CoachService;
import dot.server.data.Person.dto.CoachDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/coaches")
@CrossOrigin("*")
@Tag(name = "Admin - Coaches", description = "CRUD para entrenadores")
public class CoachController {

    @Autowired
    private CoachService serv;

    @GetMapping
    @Operation(summary = "Obtener todos los entrenadores")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(serv.list());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener entrenador por ID")
    public ResponseEntity<?> findById(@PathVariable Long id) {
        CoachDTO dto = serv.findById(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo entrenador")
    public ResponseEntity<?> create(@Valid @RequestBody CoachDTO coach) {
        boolean created = serv.create(coach);
        if (created) {
            return ResponseEntity.status(201).body(coach);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar entrenador existente")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @RequestBody CoachDTO coach
    ) {
        coach.setId(id);
        boolean updated = serv.update(coach);
        if (updated) {
            return ResponseEntity.ok(coach);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar entrenador por ID")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        boolean deleted = serv.delete(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
