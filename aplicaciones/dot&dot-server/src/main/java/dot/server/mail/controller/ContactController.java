package dot.server.mail.controller;

import dot.server.auth.jwt.JwtUtils;
import dot.server.auth.payload.response.HttpResponse;
import dot.server.auth.user.model.User;
import dot.server.mail.model.ContactForm;
import dot.server.mail.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@RestController
@RequestMapping("/contact")
public class ContactController {

    private final Map<String, LocalDateTime> messages = new HashMap<>();

    @Autowired
    EmailService emailService;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/public")
    public ResponseEntity<?> enviarFormulario(
            @RequestBody ContactForm form,
            @RequestHeader("Authorization") String token
    ) {
        String username = jwtUtils.getUserNameFromJwtToken(token.replace("Bearer ", ""));
        if (messages.containsKey(username)) {
            if(messages.get(username).isAfter(LocalDateTime.now().minusMinutes(10)))
                return ResponseEntity.ok(new HttpResponse(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Espera 10 minutos para enviar otro mensaje")
                );
        }
        emailService.enviarEmail(form);
        messages.put(username, LocalDateTime.now());
        return ResponseEntity.ok(new HttpResponse(HttpStatus.OK, "Mensaje enviado correctamente."));
    }
}
