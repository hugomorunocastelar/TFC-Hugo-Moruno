package dot.server.admin.controller.Places;

import dot.server.admin.service.Places.CitiesService;
import dot.server.auth.payload.response.HttpResponse;
import dot.server.data.MatchDefinitions.dto.CityDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/cities")
public class CitiesController {

    private final CitiesService citiesService;

    public CitiesController(CitiesService citiesService) {
        this.citiesService = citiesService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCities() {
        List<CityDto> cities = citiesService.findAll();
        return ResponseEntity.ok(cities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCityById(@PathVariable Long id) {
        return citiesService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createCity(@RequestBody CityDto cityDto) {
        CityDto created = citiesService.save(cityDto);
        return ResponseEntity.ok(new HttpResponse(HttpStatus.CREATED, created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCity(@PathVariable Long id, @RequestBody CityDto cityDto) {
        try {
            CityDto updatedCity = citiesService.update(id, cityDto);
            return ResponseEntity.ok(updatedCity);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCity(@PathVariable Long id) {
        citiesService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
