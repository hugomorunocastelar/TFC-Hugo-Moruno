package dot.server.mail.controller;

import dot.server.mail.model.ContactForm;
import dot.server.mail.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/open/mail")
public class ContactController {

    @Autowired
    EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/contact")
    public ResponseEntity<String> enviarFormulario(@RequestBody ContactForm form) {
        emailService.enviarEmail(form);
        return ResponseEntity.ok("Mensaje enviado");
    }


}
