package dot.server.admin.controller.Definitions;

import dot.server.admin.service.Definitions.SeasonService;
import dot.server.resources.MatchDefinitions.dto.SeasonDto;
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
    public ResponseEntity<List<SeasonDto>> getAllSeasons() {
        List<SeasonDto> seasons = seasonService.findAll();
        return ResponseEntity.ok(seasons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeasonDto> getSeasonById(@PathVariable Long id) {
        return seasonService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SeasonDto> createSeason(@RequestBody SeasonDto seasonDto) {
        SeasonDto created = seasonService.save(seasonDto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SeasonDto> updateSeason(@PathVariable Long id, @RequestBody SeasonDto seasonDto) {
        try {
            SeasonDto updated = seasonService.update(id, seasonDto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeason(@PathVariable Long id) {
        seasonService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
