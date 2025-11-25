package dot.server.mail.service.impl;

import dot.server.mail.model.ContactForm;
import dot.server.mail.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    JavaMailSender mailSender;

    @Override
    public void enviarEmail(ContactForm form) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("dotanddot.app.contact@gmail.com");
        message.setFrom(form.getEmail());
        message.setSubject("Solicitud de asistencia del usuario: " + form.getName());
        message.setText(
                "Nombre: " + form.getName() + "\n" +
                        "Correo: " + form.getEmail() + "\n\n" +
                        form.getMessage()
        );

        mailSender.send(message);
    }

    @Override
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setFrom("dotanddot.app.contact@gmail.com");
            helper.setSubject("Verify your account.");

            String verificationUrl = "https://dot-dot.duckdns.org/validate-account/"+token;

            String htmlContent = "<div style='background-color: #f8f9fa; padding: 20px; font-family: Arial, sans-serif;'>"
                    + "<h2 style='color: #343a40;'>¡Bienvenido!</h2>"
                    + "<p>Gracias por registrarte. Haz clic en el botón para activar tu cuenta:</p>"
                    + "<a href='" + verificationUrl + "' "
                    + "style='display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; "
                    + "text-decoration: none; border-radius: 5px; font-weight: bold;'>Activar cuenta</a>"
                    + "<p style='margin-top: 20px; color: #6c757d;'>Este enlace expirará en 24 horas.</p>"
                    + "</div>";

            helper.setText(htmlContent, true);

            message.setHeader("X-Mailer", "Spring Boot");
            message.setHeader("Precedence", "bulk");
            message.setHeader("X-Priority", "3");

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setFrom("dotanddot.app.contact@gmail.com");
            helper.setSubject("Reset your password.");

            String htmlContent = "<div style='font-family: Arial; padding: 20px;'>"
                    + "<h2>¿Olvidaste tu contraseña?</h2>"
                    + "<p>Haz clic en el siguiente botón para restablecerla:</p>"
                    + "<a href='" + resetLink + "' "
                    + "style='display: inline-block; background-color: #28a745; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;'>"
                    + "Restablecer contraseña</a>"
                    + "<p>Este enlace expirará en 1 hora.</p>"
                    + "</div>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar el correo de restablecimiento", e);
        }
    }
}
