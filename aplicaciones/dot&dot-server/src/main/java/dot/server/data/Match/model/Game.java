package dot.server.data.Match.model;

import dot.server.data.MatchDefinitions.entity.League;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
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

    @OneToMany
    @JoinColumn(name = "uniqueCode", referencedColumnName = "uniqueCode")
    @OrderBy("setNumber ASC")
    private List<GameSet> sets;

    @OneToOne(mappedBy = "game")
    private GameResult result;

    private boolean playing;

    private boolean finished;

    private int relevance;

    @ManyToOne
    @JoinColumn(name = "league_id")
    private League league;

    public GameSet getSet1() {
        return getSetByNumber(1);
    }

    public GameSet getSet2() {
        return getSetByNumber(2);
    }

    public GameSet getSet3() {
        return getSetByNumber(3);
    }

    public GameSet getSet4() {
        return getSetByNumber(4);
    }

    public GameSet getSet5() {
        return getSetByNumber(5);
    }

    private GameSet getSetByNumber(int setNumber) {
        if (sets == null) return null;
        return sets.stream()
                .filter(set -> set.getSetNumber() == setNumber)
                .findFirst()
                .orElse(null);
    }

}
