package dot.server.common.error.exceptions;

public class AlreadyExistsException extends RuntimeException {
    public AlreadyExistsException(String usedClass) {
        super("Este " + usedClass + " ya existe");
    }
}
