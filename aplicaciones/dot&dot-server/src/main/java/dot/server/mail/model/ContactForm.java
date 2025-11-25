package dot.server.mail.model;

import lombok.Data;

@Data
public class ContactForm {
    private String name;
    private String email;
    private String message;
}
