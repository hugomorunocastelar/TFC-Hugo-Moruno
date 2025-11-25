package dot.server.auth.payload.response;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class HttpResponse {
    private int status;
    private Object message;

    public HttpResponse(HttpStatus status, Object message) {
        this.status = status.value();
        this.message = message;
    }

}
