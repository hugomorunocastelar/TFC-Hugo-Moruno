package dot.server.common.dto;

import java.util.List;
import java.util.stream.Collectors;

public interface AppDto<Class, Dto> {

    Dto from(Class data);
    Class to();

    default List<Dto> from(List<Class> list) {
        if (list == null) return null;
        return list.stream()
                .map(this::from)
                .collect(Collectors.toList());
    }

    default List<Class> to(List<Dto> list) {
        if (list == null) return null;
        return list.stream()
                .map(dto -> this.to())
                .collect(Collectors.toList());
    }

}
