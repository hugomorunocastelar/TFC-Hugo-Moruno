package dot.server.serverApp.model.Match.entity;

import dot.server.serverApp.model.Club.entity.Team;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class GameResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "uniqueCode", referencedColumnName = "uniqueCode", unique = true)
    private Game game;

    private int pointsLocal;
    private int pointsVisit;

    @ManyToOne
    @JoinColumn(name = "winner_team_id")
    private Team winnerTeam;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private LocalDate timeStart;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private LocalDate timeEnd;

    private int duration;

}
