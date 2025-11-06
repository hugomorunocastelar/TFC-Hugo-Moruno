package dot.server.common.error.exceptions;

public class EmptyDataSentException extends RuntimeException {
    public EmptyDataSentException() {
        super("Contenido de la petición vacio.");
    }
}
