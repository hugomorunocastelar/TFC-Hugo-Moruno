package dot.server.resources.MatchDefinitions.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Competition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date dayStart;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date dayEnd;

}
