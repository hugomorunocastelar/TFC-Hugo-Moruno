package dot.server.common.error.exceptions;

public class DataNotFoundException extends RuntimeException {
    public DataNotFoundException() {
        super("No se encontro el registro.");
    }
}
