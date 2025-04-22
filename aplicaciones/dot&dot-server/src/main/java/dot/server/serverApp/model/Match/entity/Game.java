package dot.server.serverApp.model.Match.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true, nullable = false)
    private String uniqueCode;

    @OneToOne(mappedBy = "game")
    private GameDetails details;

    @OneToOne(mappedBy = "game")
    private GameInitialSituation initialSituation;

    @OneToOne(mappedBy = "game")
    private GameRefereeTeam refereeTeam;

    @OneToOne(mappedBy = "game")
    private GameObservations observation;

    @OneToMany(mappedBy = "game")
    private List<GameSanctions> sanctionsList;

    @OneToMany(mappedBy = "game")
    private List<GameSet> sets;

    @OneToOne(mappedBy = "game")
    private GameResult result;

}
