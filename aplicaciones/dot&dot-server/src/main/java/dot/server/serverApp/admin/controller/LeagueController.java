package dot.server.serverApp.admin.controller;

import dot.server.serverApp.admin.service.LeagueService;
import dot.server.serverApp.model.MatchDefinitions.entity.League;
import dot.server.serverApp.open.service.OpenLeagueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/leagues")
public class LeagueController {

    private final LeagueService leagueService;

    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @GetMapping
    public ResponseEntity<List<League>> getAllLeagues() {
        List<League> leagues = leagueService.findAll();
        return ResponseEntity.ok(leagues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<League> getLeagueById(@PathVariable Long id) {
        League league = leagueService.findById(id);
        if (league == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(league);
        }
    }

    @PostMapping
    public ResponseEntity<League> createLeague(@RequestBody League league) {
        League savedLeague = leagueService.save(league);
        return new ResponseEntity<>(savedLeague, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<League> updateLeague(@PathVariable Long id, @RequestBody League leagueDetails) {
        League existingLeague = leagueService.findById(id);
        if (existingLeague == null) {
            return ResponseEntity.notFound().build();
        }
        existingLeague.setName(leagueDetails.getName());
        existingLeague.setCategory(leagueDetails.getCategory());
        existingLeague.setCompetition(leagueDetails.getCompetition());
        existingLeague.setCodePrefix(leagueDetails.getCodePrefix());

        League updatedLeague = leagueService.save(existingLeague);
        return ResponseEntity.ok(updatedLeague);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeague(@PathVariable Long id) {
        if (leagueService.findById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        leagueService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
