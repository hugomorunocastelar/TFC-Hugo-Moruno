package dot.server.serverApp.open.controller;

import dot.server.serverApp.model.MatchDefinitions.entity.League;
import dot.server.serverApp.open.service.OpenLeagueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/open/leagues")
public class OpenLeagueController {

    private final OpenLeagueService openLeagueService;

    public OpenLeagueController(OpenLeagueService openLeagueService) {
        this.openLeagueService = openLeagueService;
    }

    @GetMapping
    public ResponseEntity<List<League>> getAllLeagues() {
        List<League> leagues = openLeagueService.findAll();
        return ResponseEntity.ok(leagues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<League> getLeagueById(@PathVariable Long id) {
        League league = openLeagueService.findById(id);
        if (league == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(league);
        }
    }
}
