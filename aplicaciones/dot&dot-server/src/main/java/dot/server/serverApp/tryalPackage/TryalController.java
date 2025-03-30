package dot.server.serverApp.tryalPackage;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/check")
public class TryalController {

    @GetMapping("/health")
    public ResponseEntity<?> checkHealth() {
        return ResponseEntity.ok(1);
    }

}
