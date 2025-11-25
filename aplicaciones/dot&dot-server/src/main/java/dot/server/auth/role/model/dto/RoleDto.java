package dot.server.auth.role.model.dto;

import dot.server.auth.role.model.Role;
import lombok.Data;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
public class RoleDto {

    private Long id;
    private String name;
    private Instant createdAt;
    private Instant updatedAt;

    public static RoleDto from(Role role) {
        if (role == null) return null;
        RoleDto dto = new RoleDto();
        dto.setId(role.getId());
        dto.setName(role.getName());
        dto.setCreatedAt(role.getCreatedAt());
        dto.setUpdatedAt(role.getUpdatedAt());
        return dto;
    }

    public Role to() {
        Role entity = new Role();
        entity.setId(id);
        entity.setName(name);
        entity.setCreatedAt(createdAt);
        entity.setUpdatedAt(updatedAt);
        return entity;
    }

    public static List<RoleDto> from(List<Role> roles) {
        List<RoleDto> dtos = new ArrayList<>();
        for (Role role : roles) {
            dtos.add(from(role));
        }
        return dtos;
    }

    public static List<Role> to(List<RoleDto> roles) {
        List<Role> entities = new ArrayList<>();
        for (RoleDto role : roles) {
            entities.add(role.to());
        }
        return entities;
    }

}