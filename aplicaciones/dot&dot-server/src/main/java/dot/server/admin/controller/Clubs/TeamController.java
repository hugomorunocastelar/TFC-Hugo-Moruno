package dot.server.admin.controller.Clubs;

import dot.server.admin.service.Clubs.TeamService;
import dot.server.data.Club.dto.TeamDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/teams")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<?> createTeam(@RequestBody TeamDto teamDto) {
        TeamDto createdTeam = teamService.createTeam(teamDto);
        return ResponseEntity.ok(createdTeam);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeamById(@PathVariable Long id) {
        return teamService.getTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<?> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody TeamDto teamDto) {
        try {
            TeamDto updatedTeam = teamService.updateTeam(id, teamDto);
            return ResponseEntity.ok(updatedTeam);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        teamService.deleteTeam(id);
        return ResponseEntity.noContent().build();
    }
}
