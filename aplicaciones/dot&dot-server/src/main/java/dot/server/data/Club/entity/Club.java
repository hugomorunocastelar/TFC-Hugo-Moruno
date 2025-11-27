package dot.server.data.Club.entity;

import dot.server.data.MatchDefinitions.entity.City;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(nullable = false)
    private City idCity;

}
