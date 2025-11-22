package dot.server.mail.service;

import dot.server.mail.model.ContactForm;
import org.springframework.stereotype.Service;

@Service
public interface EmailService {
    void enviarEmail(ContactForm form);

    void sendVerificationEmail(String toEmail, String token);

    void sendPasswordResetEmail(String toEmail, String resetLink);
}
