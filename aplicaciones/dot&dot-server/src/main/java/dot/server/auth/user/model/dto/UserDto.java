package dot.server.auth.user.model.dto;

import dot.server.auth.role.model.Role;
import dot.server.auth.user.model.User;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String password;
    private Set<Role> roles;
    private Instant createdAt;
    private Instant updatedAt;

    public static UserDto to(User user) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setPassword(user.getPassword());
        dto.setRoles(user.getRoles());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    public static User from(UserDto dto) {
        if (dto == null) return null;

        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRoles(dto.getRoles());
        user.setCreatedAt(dto.getCreatedAt());
        user.setUpdatedAt(dto.getUpdatedAt());
        return user;
    }

    public static List<UserDto> to(List<User> users) {
        if (users == null) return null;

        return users.stream()
                .map(UserDto::to)
                .collect(Collectors.toList());
    }

    public static List<User> from(List<UserDto> dtos) {
        if (dtos == null) return null;

        return dtos.stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

}
