package dot.server.data.Match.model.dto;

import java.util.List;
import java.util.stream.Collectors;

public interface DtoMapper<E, D> {

    D to(E entity);

    E from(D dto);

    default List<D> to(List<E> entities) {
        if (entities == null) return null;
        return entities.stream().map(this::to).collect(Collectors.toList());
    }

    default List<E> from(List<D> dtos) {
        if (dtos == null) return null;
        return dtos.stream().map(this::from).collect(Collectors.toList());
    }
}
