package dot.server.data.Match.controller;

import dot.server.data.Match.model.dto.GameSummaryDto;
import dot.server.data.Match.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/matches")
@RequiredArgsConstructor
public class MatchesController {

    private final MatchService matchService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllMatches() {
        return null;
    }

    @GetMapping("/unplayed")
    public ResponseEntity<?> getUnplayedMatches() {
        return null;
    }

    @GetMapping("/ongoing")
    public ResponseEntity<?> getOngoingMatches() {
        return null;
    }

    @GetMapping("/played")
    public ResponseEntity<?> getPlayedMatches() {
        return null;
    }

    @GetMapping("/league/{leagueId}")
    public ResponseEntity<?> getGamesByLeague(@PathVariable Long leagueId) {
        return ResponseEntity.ok(matchService.getGamesByLeague(leagueId));
    }
}
