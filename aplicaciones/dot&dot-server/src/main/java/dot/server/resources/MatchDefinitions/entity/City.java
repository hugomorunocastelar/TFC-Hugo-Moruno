package dot.server.resources.MatchDefinitions.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 50)
    private String region;

    @Column(length = 10, nullable = false)
    private String firstPC;

    @Column(length = 10)
    private String lastPC;

}
