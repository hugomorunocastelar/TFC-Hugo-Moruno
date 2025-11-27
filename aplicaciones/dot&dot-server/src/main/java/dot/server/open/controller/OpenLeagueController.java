package dot.server.open.controller;

import dot.server.open.service.OpenLeagueService;
import dot.server.data.MatchDefinitions.entity.League;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
