package dot.server.admin.controller.Definitions;

import dot.server.admin.service.Definitions.SeasonService;
import dot.server.auth.payload.response.HttpResponse;
import dot.server.data.MatchDefinitions.dto.SeasonDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/seasons")
public class SeasonController {

    private final SeasonService seasonService;

    public SeasonController(SeasonService seasonService) {
        this.seasonService = seasonService;
    }

    @GetMapping
    public ResponseEntity<?> getAllSeasons() {
        List<SeasonDto> seasons = seasonService.findAll();
        return ResponseEntity.ok(seasons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSeasonById(@PathVariable Long id) {
        return seasonService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createSeason(@RequestBody SeasonDto seasonDto) {
        SeasonDto created = seasonService.save(seasonDto);
        return ResponseEntity.ok(new HttpResponse(HttpStatus.CREATED, created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSeason(@PathVariable Long id, @RequestBody SeasonDto seasonDto) {
        try {
            SeasonDto updated = seasonService.update(id, seasonDto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSeason(@PathVariable Long id) {
        seasonService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
