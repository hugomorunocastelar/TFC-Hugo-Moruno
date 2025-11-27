package dot.server.admin.controller.Game;

import dot.server.admin.service.Game.GameService;
import dot.server.data.Match.model.dto.GameDto;
import dot.server.data.Match.model.dto.GameSummaryDto;
import dot.server.data.Match.model.dto.request.CreateGameRequest;
import dot.server.data.Match.model.dto.request.UpdateGameRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/admin/games")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class GameController {

    private final GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameDto>> getAllGames() {
        return ResponseEntity.ok(gameService.findAll());
    }
    
    @GetMapping("/summary")
    public ResponseEntity<List<GameSummaryDto>> getAllGamesSummary() {
        return ResponseEntity.ok(gameService.findSummerizedAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameDto> getGameById(@PathVariable Long id) {
        return gameService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{uniqueCode}")
    public ResponseEntity<GameDto> getGameByUniqueCode(@PathVariable String uniqueCode) {
        return gameService.findByUniqueCode(uniqueCode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<GameDto> createGame(@RequestBody CreateGameRequest request) {
        try {
            GameDto created = gameService.create(request);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameDto> updateGame(@PathVariable Long id, @RequestBody UpdateGameRequest request) {
        try {
            return gameService.update(id, request)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        if (gameService.delete(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
