package dot.server.referee.controller;

import dot.server.data.Match.model.Game;
import dot.server.referee.service.RefereeGamesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/referee/games")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_REFEREE')")
public class RefereeGamesController {

    private final RefereeGamesService refereeGamesService;

    /**
     * Get all games where the referee with the given ID is assigned
     * GET /referee/games/{refereeId}
     */
    @GetMapping("/{refereeId}")
    public ResponseEntity<?> getGamesByReferee(@PathVariable Long refereeId) {
        try {
            List<Game> games = refereeGamesService.getGamesByRefereeId(refereeId);
            return ResponseEntity.ok(games);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error retrieving games for referee: " + e.getMessage()));
        }
    }
}
