package dot.server.resources.Match.model;

import dot.server.resources.Club.entity.Team;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

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
    private Date timeStart;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date timeEnd;

    private int duration;

}
