package dot.server.data.Match.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;


@Entity
@Data
public class GameSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String uniqueCode;

    private int setNumber; 

    private int pointsLocal = 0;
    private int pointsVisit = 0;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStart;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timeEnd;

    @Column(length = 20)
    private String localAlignment;

    @Column(length = 20)
    private String visitAlignment;

}
