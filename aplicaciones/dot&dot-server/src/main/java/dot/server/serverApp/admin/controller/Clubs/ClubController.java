package dot.server.serverApp.admin.controller;

import dot.server.serverApp.admin.service.ClubService;
import dot.server.serverApp.model.Club.entity.Club;
import dot.server.serverApp.open.service.OpenClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin/clubs")
public class ClubController {

    @Autowired
    private ClubService clubService;

    @PostMapping
    public ResponseEntity<?> createClub(@RequestBody Club club) {
        Club createdClub = clubService.create(club);
        return ResponseEntity.ok(createdClub);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClubById(@PathVariable Long id) {
        Club club = clubService.findById(id);
        return ResponseEntity.ok(club);
    }

    @GetMapping
    public ResponseEntity<?> getAllClubs() {
        List<Club> clubs = clubService.findAll();
        return ResponseEntity.ok(clubs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateClub(@PathVariable Long id, @RequestBody Club club) {
        Club updatedClub = clubService.update(id, club);
        return ResponseEntity.ok(updatedClub);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteClub(@PathVariable Long id) {
        clubService.delete(id);
        return ResponseEntity.ok(id);
    }
}
