package dot.server.resources.Match.model;

import dot.server.resources.Club.entity.Team;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class GameInitialSituation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "uniqueCode", referencedColumnName = "uniqueCode", unique = true)
    private Game game;

    @ManyToOne
    @JoinColumn(name = "local_team_id")
    private Team localTeam;

    @ManyToOne
    @JoinColumn(name = "visit_team_id")
    private Team visitTeam;

    @ManyToOne
    @JoinColumn(name = "starting_team_id")
    private Team startingTeam;

    @ManyToOne
    @JoinColumn(name = "left_team_id")
    private Team leftTeam;

}
