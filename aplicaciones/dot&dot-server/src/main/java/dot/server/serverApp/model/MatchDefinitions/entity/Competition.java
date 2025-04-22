package dot.server.serverApp.model.MatchDefinitions.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Competition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50, nullable = false)
    private String name;

}
