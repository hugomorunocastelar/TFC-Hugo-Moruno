package dot.server.common.error.handler;

import dot.server.common.error.message.ErrorResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

import static dot.server.common.error.message.ErrorList.ER01;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger exceptionLog = LoggerFactory.getLogger("exceptions");

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(IllegalArgumentException ex) {
        exceptionLog.error("IllegalArgumentException: {}", ex.getMessage(), ex);
        
        ErrorResponse error = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                LocalDateTime.now().toString()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        exceptionLog.error("RuntimeException: {}", ex.getMessage(), ex);
        
        ErrorResponse error = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now().toString()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex) {
        exceptionLog.error("Unhandled exception: {}", ex.getMessage(), ex);
        
        ErrorResponse error = new ErrorResponse(
                ER01.getMensaje(),
                ER01.getCodigo(),
                LocalDateTime.now().toString()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}