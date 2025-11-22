package dot.server.auth.role.service.impl;

import dot.server.auth.role.model.Role;
import dot.server.auth.role.repository.RoleRepository;
import dot.server.auth.role.service.RoleService;
import dot.server.common.error.exceptions.AlreadyExistsException;
import dot.server.common.error.exceptions.DataNotFoundException;
import dot.server.common.error.exceptions.EmptyDataSentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RoleServiceImpl implements RoleService {

    private final String className = Role.class.getName();

    @Autowired
    private RoleRepository repo;

    @Override
    public List<Role> findAll() {
        return repo.findAll();
    }

    @Override
    public Role findById(Long id) {
        return repo.findById(id).orElseThrow(DataNotFoundException::new);
    }

    @Override
    public Role findByName(String name) {
        return repo.findByName(name).orElseThrow(DataNotFoundException::new);
    }

    @Override
    public Role save(Role role) {
        if (role == null || role.getName().isEmpty()) throw new EmptyDataSentException();

        try {
            findByName(role.getName());
            throw new AlreadyExistsException(className);
        } catch (DataNotFoundException ignored) {
        }

        if (role.getId() != null) role.setId(null);

        return repo.save(role);
    }

    @Override
    public Role update(Long id, Role role) {
        if (role == null || role.getName().isEmpty()) throw new EmptyDataSentException();

        Role existing = findById(id);
        repo.findByName(role.getName()).ifPresent(existingRole -> {
            if (!existingRole.getId().equals(id)) throw new AlreadyExistsException(className);
        });
        existing.setName(role.getName());
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.delete(findById(id));
    }
}
