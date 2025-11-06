package dot.server.resources.MatchDefinitions.entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;


@Entity
@Data
public class Season {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50)
    private String name;

    @Temporal(TemporalType.DATE)
    private Date initialDay;

    @Temporal(TemporalType.DATE)
    private Date finalisationDay;

}
