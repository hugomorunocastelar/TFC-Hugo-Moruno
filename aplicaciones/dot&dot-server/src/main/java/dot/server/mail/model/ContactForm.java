package dot.server.mail.model;

import lombok.Data;

@Data
public class ContactForm {
    private String nombre;
    private String correo;
    private String mensaje;
}
