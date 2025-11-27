package dot.server.open.controller;

import dot.server.admin.service.Game.GameService;
import dot.server.data.Match.model.dto.GameSummaryDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/open/games")
public class OpenGameController {

    @Autowired
    GameService gameService;

    @GetMapping
    public ResponseEntity<List<GameSummaryDto>> getAllGames() {
        return ResponseEntity.ok(gameService.findSummerizedAll());
    }

    @GetMapping("/outstanding-match")
    public ResponseEntity<GameSummaryDto> getOutstandingMatch() {
        return ResponseEntity.ok(gameService.getOutstandingMatch());
    }
}
