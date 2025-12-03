package dot.server.open.controller;

import dot.server.admin.service.Game.GameService;
import dot.server.data.Match.model.dto.GameDto;
import dot.server.data.Match.model.dto.GameSummaryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/open/games")
public class OpenGameController {

    @Autowired
    GameService gameService;

    @GetMapping
    public ResponseEntity<?> getAllGames() {
        return ResponseEntity.ok(gameService.findSummerizedAll());
    }

    @GetMapping("/outstanding-match")
    public ResponseEntity<?> getOutstandingMatch() {
        return ResponseEntity.ok(gameService.getOutstandingMatch());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGameById(@PathVariable Long id) {
        return gameService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
