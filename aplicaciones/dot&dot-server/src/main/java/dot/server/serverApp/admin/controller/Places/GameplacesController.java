package dot.server.serverApp.admin.controller;

import dot.server.serverApp.admin.service.GameplacesService;
import dot.server.serverApp.model.MatchDefinitions.dto.GameplaceDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/gameplaces")
public class GameplacesController {

    private final GameplacesService gameplaceService;

    public GameplacesController(GameplacesService gameplaceService) {
        this.gameplaceService = gameplaceService;
    }

    @PostMapping
    public ResponseEntity<GameplaceDto> createGameplace(@RequestBody GameplaceDto gameplaceDto) {
        GameplaceDto created = gameplaceService.createGameplace(gameplaceDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameplaceDto> getGameplaceById(@PathVariable Long id) {
        return gameplaceService.getGameplaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<GameplaceDto>> getAllGameplaces() {
        List<GameplaceDto> list = gameplaceService.getAllGameplaces();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameplaceDto> updateGameplace(@PathVariable Long id, @RequestBody GameplaceDto gameplaceDto) {
        try {
            GameplaceDto updated = gameplaceService.updateGameplace(id, gameplaceDto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGameplace(@PathVariable Long id) {
        gameplaceService.deleteGameplace(id);
        return ResponseEntity.noContent().build();
    }
}
