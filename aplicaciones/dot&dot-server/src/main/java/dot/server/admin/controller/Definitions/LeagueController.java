package dot.server.admin.controller.Definitions;

import dot.server.admin.service.Definitions.LeagueService;
import dot.server.resources.MatchDefinitions.dto.LeagueDto;
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
    public ResponseEntity<List<LeagueDto>> getAllLeagues() {
        List<LeagueDto> leagues = leagueService.findAll();
        return ResponseEntity.ok(leagues);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeagueDto> getLeagueById(@PathVariable Long id) {
        LeagueDto league = leagueService.findById(id);
        if (league == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(league);
        }
    }

    @PostMapping
    public ResponseEntity<LeagueDto> createLeague(@RequestBody LeagueDto leagueDto) {
        LeagueDto savedLeague = leagueService.save(leagueDto);
        return new ResponseEntity<>(savedLeague, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeagueDto> updateLeague(@PathVariable Long id, @RequestBody LeagueDto leagueDto) {
        LeagueDto existingLeague = leagueService.findById(id);
        if (existingLeague == null) return ResponseEntity.notFound().build();
        existingLeague.setName(leagueDto.getName());
        existingLeague.setCategory(leagueDto.getCategory());
        existingLeague.setCompetition(leagueDto.getCompetition());
        existingLeague.setCodePrefix(leagueDto.getCodePrefix());

        LeagueDto updatedLeague = leagueService.save(existingLeague);
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
