package dot.server.serverApp.model.Match.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class GameSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "uniqueCode", referencedColumnName = "uniqueCode")
    private Game game;

    private int pointsLocal;
    private int pointsVisit;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private LocalDate timeStart;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private LocalDate timeEnd;

    @Column(length = 20, nullable = false)
    private String localAlignment;

    @Column(length = 20, nullable = false)
    private String visitAlignment;

}
