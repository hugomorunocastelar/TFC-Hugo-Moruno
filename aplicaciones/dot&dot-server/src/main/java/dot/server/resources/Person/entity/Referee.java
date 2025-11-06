package dot.server.resources.Person.entity;

import dot.server.resources.Match.model.GameRefereeTeam;
import dot.server.resources.MatchDefinitions.entity.City;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Referee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 20, nullable = false)
    private String noLicense;

    @Column(length = 3, nullable = false)
    private String lvlLicense;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @OneToOne
    @JoinColumn(name = "person_id", unique = true)
    private Person dni;

    @OneToMany(mappedBy = "principalReferee")
    private List<GameRefereeTeam> gamesAsPrincipal;

    @OneToMany(mappedBy = "secondaryReferee")
    private List<GameRefereeTeam> gamesAsSecondary;

    @OneToMany(mappedBy = "scorer")
    private List<GameRefereeTeam> gamesAsScorer;

    @OneToMany(mappedBy = "lineReferee1")
    private List<GameRefereeTeam> gamesAsLineRef1;

    @OneToMany(mappedBy = "lineReferee2")
    private List<GameRefereeTeam> gamesAsLineRef2;

    @OneToMany(mappedBy = "lineReferee3")
    private List<GameRefereeTeam> gamesAsLineRef3;

    @OneToMany(mappedBy = "lineReferee4")
    private List<GameRefereeTeam> gamesAsLineRef4;

}
