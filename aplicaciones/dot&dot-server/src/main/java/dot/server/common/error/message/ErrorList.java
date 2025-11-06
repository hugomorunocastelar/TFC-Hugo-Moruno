package dot.server.common.error.message;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorList {

    ER01("Ha ocurrido un error inesperado.", HttpStatus.INTERNAL_SERVER_ERROR.value());

    private final String mensaje;
    private final int codigo;

    ErrorList(String mensaje, int codigo) {
        this.mensaje = mensaje;
        this.codigo = codigo;
    }
}
