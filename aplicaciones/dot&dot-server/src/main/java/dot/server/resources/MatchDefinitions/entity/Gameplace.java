package dot.server.resources.MatchDefinitions.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Gameplace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(nullable = false)
    private int Gamefields = 1;

    @Column(length = 100, nullable = false)
    private String address;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City idCity;

}
