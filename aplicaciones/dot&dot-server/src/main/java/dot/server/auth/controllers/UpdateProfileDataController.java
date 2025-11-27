package dot.server.auth.controllers;

import dot.server.auth.jwt.JwtUtils;
import dot.server.auth.payload.request.UpdateSelfUserRequest;
import dot.server.auth.payload.response.HttpResponse;
import dot.server.auth.user.model.User;
import dot.server.auth.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/open/users")
public class UpdateProfileDataController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    UserService userService;

    @PutMapping("/self")
    public ResponseEntity<?> updateSelfUser(
        @RequestBody UpdateSelfUserRequest data,
        @RequestHeader("Authorization") String token
    ) {
        String username = jwtUtils.getUserNameFromJwtToken(token.substring("Bearer ".length()));
        String email = data.getEmail();
        String password = data.getPassword();

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

            if (authentication.isAuthenticated()) {
                User user = userService.findByUsername(username);
                user.setEmail(email);
                userService.update(user.getId(), user);
                return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, "Usuario actualizado correctamente"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(new HttpResponse(HttpStatus.UNAUTHORIZED, "Usuario no encontrado / Credenciales incorrectas."));
        }
        return ResponseEntity.ok(new HttpResponse(HttpStatus.UNAUTHORIZED, ""));
    }
}
