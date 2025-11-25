package dot.server.auth.payload.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    String token;
    String newPassword;
    String confirmPassword;
}
