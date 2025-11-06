package dot.server.common.object;

public interface AppObject {

    Long id = 0L;
    String name = "";

    Long getId();
    void setId(Long id);
    String getName();
    void setName(String name);

}
