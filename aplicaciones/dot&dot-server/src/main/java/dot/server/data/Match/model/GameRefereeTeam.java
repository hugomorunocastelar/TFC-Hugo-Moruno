package dot.server.data.Match.model;

import dot.server.data.Person.entity.Referee;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class GameRefereeTeam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "uniqueCode", referencedColumnName = "uniqueCode", unique = true)
    private Game game;

    @ManyToOne
    @JoinColumn(name = "principal_referee_id", nullable = false)
    private Referee principalReferee;

    @ManyToOne
    @JoinColumn(name = "secondary_referee_id")
    private Referee secondaryReferee;

    @ManyToOne
    @JoinColumn(name = "scorer_id", nullable = false)
    private Referee scorer;

    @ManyToOne
    @JoinColumn(name = "line_referee_1_id")
    private Referee lineReferee1;

    @ManyToOne
    @JoinColumn(name = "line_referee_2_id")
    private Referee lineReferee2;

    @ManyToOne
    @JoinColumn(name = "line_referee_3_id")
    private Referee lineReferee3;

    @ManyToOne
    @JoinColumn(name = "line_referee_4_id")
    private Referee lineReferee4;


}
