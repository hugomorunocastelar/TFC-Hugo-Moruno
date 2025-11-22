package dot.server.auth.controllers;

import dot.server.auth.jwt.JwtUtils;
import dot.server.auth.payload.response.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/validate")
public class PermissionController {

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("")
    public ResponseEntity<?> validateUser(
            @RequestHeader("Authorization") String token
    ) {
        token = token.substring(7);
        if (jwtUtils.validateJwtToken(token))
            return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, true));
        else
            return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, false));
    }

    @GetMapping("/roles")
    public boolean checkRole(@RequestBody List<String> roles) {
        return true;
    }
}
