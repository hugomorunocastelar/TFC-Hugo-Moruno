package dot.server.serverApp.match.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/recent-matches")
public class RecentMatches {

    @GetMapping("")
    public ResponseEntity<?> getRecentMatches() {

        return ResponseEntity.ok().build();
    }

}
