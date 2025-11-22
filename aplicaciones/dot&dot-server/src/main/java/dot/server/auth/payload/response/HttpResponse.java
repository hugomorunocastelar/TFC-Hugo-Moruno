package dot.server.auth.payload.response;

import lombok.Data;
import org.springframework.http.HttpStatus;

@Data
public class HttpResponse {
    private HttpStatus status;
    private Object message;

    public HttpResponse(HttpStatus status, Object message) {
        this.status = status;
        this.message = message;
    }

}
