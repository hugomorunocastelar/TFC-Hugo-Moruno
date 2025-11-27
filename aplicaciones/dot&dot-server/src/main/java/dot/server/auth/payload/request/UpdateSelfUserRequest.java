package dot.server.auth.payload.request;

import lombok.Data;

@Data
public class UpdateSelfUserRequest {
    private String email;
    private String password;
}
