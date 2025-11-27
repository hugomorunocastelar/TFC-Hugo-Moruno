package dot.server.admin.controller.Definitions;

import dot.server.admin.service.Definitions.CompetitionService;
import dot.server.data.MatchDefinitions.dto.CompetitionDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/competitions")
public class CompetitionController {

    private final CompetitionService competitionService;

    public CompetitionController(CompetitionService competitionService) {
        this.competitionService = competitionService;
    }

    @PostMapping
    public ResponseEntity<CompetitionDto> createCompetition(@RequestBody CompetitionDto competitionDto) {
        CompetitionDto created = competitionService.createCompetition(competitionDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompetitionDto> getCompetitionById(@PathVariable Long id) {
        return competitionService.getCompetitionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<CompetitionDto>> getAllCompetitions() {
        List<CompetitionDto> list = competitionService.getAllCompetitions();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompetitionDto> updateCompetition(@PathVariable Long id, @RequestBody CompetitionDto competitionDto) {
        try {
            CompetitionDto updated = competitionService.updateCompetition(id, competitionDto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompetition(@PathVariable Long id) {
        competitionService.deleteCompetition(id);
        return ResponseEntity.noContent().build();
    }
}
