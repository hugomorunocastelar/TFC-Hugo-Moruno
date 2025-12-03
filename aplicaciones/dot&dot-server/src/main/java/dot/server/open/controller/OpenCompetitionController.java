package dot.server.open.controller;

import dot.server.open.service.OpenCompetitionService;
import dot.server.data.MatchDefinitions.entity.Competition;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/open/competitions")
public class OpenCompetitionController {

    private final OpenCompetitionService openCompetitionService;

    public OpenCompetitionController(OpenCompetitionService openCompetitionService) {
        this.openCompetitionService = openCompetitionService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCompetitions() {
        List<Competition> competitions = openCompetitionService.findAll();
        return ResponseEntity.ok(competitions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompetitionById(@PathVariable Long id) {
        Competition competition = openCompetitionService.findById(id);
        if (competition == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(competition);
        }
    }
}
