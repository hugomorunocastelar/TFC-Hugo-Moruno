package dot.server.common.service.impl;

import dot.server.common.error.exceptions.AlreadyExistsException;
import dot.server.common.error.exceptions.DataNotFoundException;
import dot.server.common.error.exceptions.EmptyDataSentException;
import dot.server.common.object.AppObject;
import dot.server.common.repository.AppRepository;
import dot.server.common.service.AppService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AppServiceImpl<Class extends AppObject> implements AppService<Class> {

    @Autowired
    private AppRepository<Class> repo;

    @Override
    public List<Class> findAll() {
        return repo.findAll();
    }

    @Override
    public Class findById(Long id) {
        return repo.findById(id).orElseThrow(DataNotFoundException::new);
    }

    @Override
    public Class findByName(String name) {
        return repo.findByName(name).orElseThrow(DataNotFoundException::new);
    }

    @Override
    public Class save(Class data) {
        if (data == null || data.getName().isEmpty()) throw new EmptyDataSentException();

        try {
            findByName(data.getName());
            throw new AlreadyExistsException("");
        } catch (DataNotFoundException ignored) {}

        if (data.getId() != null) data.setId(null);

        return repo.save(data);
    }

    @Override
    public Class update(Long id, Class data) {
        if (data == null || data.getName().isEmpty()) throw new EmptyDataSentException();

        Class existing = findById(id);
        repo.findByName(data.getName()).ifPresent(existingData -> {
            if (!existingData.getId().equals(id)) throw new AlreadyExistsException("className");
        });
        existing.setName(data.getName());
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.delete(findById(id));
    }
}
