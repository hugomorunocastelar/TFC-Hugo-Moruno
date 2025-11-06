package dot.server.common.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AppService<Class> {

    List<Class> findAll();
    Class findById(Long id);
    Class findByName(String name);
    Class save(Class data);
    Class update(Long id, Class data);
    void delete(Long id);
    
}
