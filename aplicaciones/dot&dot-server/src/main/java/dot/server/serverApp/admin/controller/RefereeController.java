package dot.server.serverApp.admin.controller;

import dot.server.serverApp.admin.service.RefereeService;
import dot.server.serverApp.model.Person.entity.Referee;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/referees")
@Tag(name = "Referee Controller", description = "Operaciones relacionadas con los árbitros")
public class RefereeController {

    private final RefereeService refereeService;

    @Autowired
    public RefereeController(RefereeService refereeService) {
        this.refereeService = refereeService;
    }

    @PostMapping
    @Operation(summary = "Crear un nuevo árbitro")
    public ResponseEntity<Referee> createReferee(@RequestBody Referee referee) {
        return ResponseEntity.ok(refereeService.save(referee));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener árbitro por ID")
    public ResponseEntity<Referee> getReferee(@PathVariable Long id) {
        return ResponseEntity.ok(refereeService.findById(id));
    }

    @GetMapping
    @Operation(summary = "Listar todos los árbitros")
    public ResponseEntity<List<Referee>> getAllReferees() {
        return ResponseEntity.ok(refereeService.findAll());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar un árbitro por ID")
    public ResponseEntity<Referee> updateReferee(@PathVariable Long id, @RequestBody Referee referee) {
        try {
            return ResponseEntity.ok(refereeService.update(id, referee));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar un árbitro por ID")
    public ResponseEntity<Void> deleteReferee(@PathVariable Long id) {
        refereeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
