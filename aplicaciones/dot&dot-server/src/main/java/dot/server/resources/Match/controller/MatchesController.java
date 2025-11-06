package dot.server.resources.Match.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/matches")
public class MatchesController {

    @GetMapping("/all")
    public ResponseEntity<?> getAllMatches() {

        return null;
    }

    @GetMapping("/unplayed")
    public ResponseEntity<?> getUnplayedMatches(){

        return null;
    }

    @GetMapping("/ongoing")
    public ResponseEntity<?> getOngoingMatches(){

        return null;
    }

    @GetMapping("/played")
    public ResponseEntity<?> getPlayedMatches(){

        return null;
    }

}
