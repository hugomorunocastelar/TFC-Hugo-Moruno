package dot.server.data.Match.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/recent-matches")
public class RecentMatches {

    @GetMapping("")
    public ResponseEntity<?> getRecentMatches() {

        return ResponseEntity.ok().build();
    }

}
