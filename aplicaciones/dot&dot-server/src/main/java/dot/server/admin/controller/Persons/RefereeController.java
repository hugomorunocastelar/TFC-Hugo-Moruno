package dot.server.admin.controller.Persons;

import dot.server.admin.service.Persons.RefereeService;
import dot.server.auth.payload.response.HttpResponse;
import dot.server.data.Person.dto.RefereeDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/referees")
public class RefereeController {

    private final RefereeService refereeService;

    public RefereeController(RefereeService refereeService) {
        this.refereeService = refereeService;
    }

    @GetMapping
    public ResponseEntity<?> getAllReferees() {
        List<RefereeDTO> referees = refereeService.findAll();
        return ResponseEntity.ok(referees);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRefereeById(@PathVariable Long id) {
        return refereeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createReferee(@RequestBody RefereeDTO refereeDTO) {
        RefereeDTO created = refereeService.save(refereeDTO);
        return ResponseEntity.ok(new HttpResponse(HttpStatus.CREATED, created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReferee(@PathVariable Long id, @RequestBody RefereeDTO refereeDTO) {
        try {
            RefereeDTO updated = refereeService.update(id, refereeDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReferee(@PathVariable Long id) {
        refereeService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
