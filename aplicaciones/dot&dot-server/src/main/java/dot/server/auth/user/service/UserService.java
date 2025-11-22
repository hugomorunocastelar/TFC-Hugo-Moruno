package dot.server.auth.user.service;

import dot.server.auth.user.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserService {

    User save(User user);

    User findById(Long id);

    List<User> findAll();

    User update(Long id, User user);

    void deleteById(Long id);

}
