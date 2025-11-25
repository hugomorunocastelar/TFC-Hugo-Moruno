package dot.server.auth.controllers;

import dot.server.auth.jwt.JwtUtils;
import dot.server.auth.payload.response.HttpResponse;
import dot.server.common.error.exceptions.EmptyDataSentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/validate")
public class PermissionController {

    @Autowired
    JwtUtils jwtUtils;

    @GetMapping("/user")
    public ResponseEntity<?> validateUser(
            @RequestHeader("Authorization") String token
    ) {
        token = token.substring(7);
        if (jwtUtils.validateJwtToken(token))
            return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, true));
        else
            return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, false));
    }

    @GetMapping("/rol/{name}")
    public ResponseEntity<?> userAccess(
            @PathVariable String name
    ) {
        if (name == null || name.isEmpty()) throw new EmptyDataSentException();
        name = name.toUpperCase();
        if (!name.startsWith("ROLE_")) name = "ROLE_" + name;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String finalName = name;
        boolean hasRole = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals(finalName));
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(role -> role.equals("ROLE_ADMIN"));

        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, hasRole || isAdmin));
    }
}
