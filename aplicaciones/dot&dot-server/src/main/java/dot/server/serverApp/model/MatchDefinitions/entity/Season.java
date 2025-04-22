package dot.server.serverApp.model.MatchDefinitions.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Season {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50)
    private String name;

    @Temporal(TemporalType.DATE)
    private LocalDate initialDay;

    @Temporal(TemporalType.DATE)
    private LocalDate finalisationDay;

}
