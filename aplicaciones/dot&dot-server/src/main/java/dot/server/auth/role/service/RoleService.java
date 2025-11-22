package dot.server.auth.role.service;

import dot.server.auth.role.model.Role;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoleService {

    List<Role> findAll();

    Role findById(Long id);

    Role findByName(String name);

    Role save(Role roleDTO);

    Role update(Long id, Role role);

    void delete(Long id);
}
