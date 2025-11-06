package dot.server.resources.Match.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class GameObservations {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "uniqueCode", referencedColumnName = "uniqueCode", unique = true)
    private Game game;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

}
