package dot.server.data.Match.model;

import dot.server.data.Club.entity.Team;
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

    private int setsWonLocal; 
    private int setsWonVisit; 

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
