package dot.server.open.controller;

import dot.server.resources.Club.entity.Club;
import dot.server.open.service.OpenClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/open/clubs")
public class OpenClubController {

    @Autowired
    private OpenClubService openClubService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getClubById(@PathVariable Long id) {
        Club club = openClubService.findById(id);
        return ResponseEntity.ok(club);
    }

    @GetMapping
    public ResponseEntity<?> getAllClubs() {
        List<Club> clubs = openClubService.findAll();
        return ResponseEntity.ok(clubs);
    }
}
