
import dot.server.serverApp.auth.models.Role;
import dot.server.serverApp.auth.models.RoleEnum;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Data public class RoleDTO { private Long id; private RoleEnum name; private Instant createdAt; private Instant updatedAt;
  public static RoleDTO from(Role role) {
    if (role == null) return null;
    RoleDTO dto = new RoleDTO();
    dto.setId(role.getId());
    dto.setName(role.getName());
    dto.setCreatedAt(role.getCreatedAt());
    dto.setUpdatedAt(role.getUpdatedAt());
    return dto;
  }

  public static Role to(RoleDTO dto) {
    if (dto == null) return null;
    Role role = new Role();
    role.setId(dto.getId());
    role.setName(dto.getName());
    role.setCreatedAt(dto.getCreatedAt());
    role.setUpdatedAt(dto.getUpdatedAt());
    return role;
  }

  public static List<RoleDTO> from(List<Role> roles) {
    if (roles == null) return null;
    return roles.stream().map(RoleDTO::from).collect(Collectors.toList());
  }

  public static List<Role> to(List<RoleDTO> dtos) {
    if (dtos == null) return null;
    return dtos.stream().map(RoleDTO::to).collect(Collectors.toList());
  }
}