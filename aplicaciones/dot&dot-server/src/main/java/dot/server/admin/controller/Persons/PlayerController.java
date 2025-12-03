package dot.server.admin.controller.Persons;

import dot.server.admin.service.Persons.PlayerService;
import dot.server.auth.payload.response.HttpResponse;
import dot.server.data.Person.dto.PlayerDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPlayers() {
        List<PlayerDTO> players = playerService.findAll();
        return ResponseEntity.ok(players);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPlayerById(@PathVariable Long id) {
        return playerService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createPlayer(@RequestBody PlayerDTO playerDTO) {
        PlayerDTO created = playerService.save(playerDTO);
        return ResponseEntity.ok(new HttpResponse(HttpStatus.CREATED, created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlayer(@PathVariable Long id, @RequestBody PlayerDTO playerDTO) {
        try {
            PlayerDTO updated = playerService.update(id, playerDTO);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlayer(@PathVariable Long id) {
        playerService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
