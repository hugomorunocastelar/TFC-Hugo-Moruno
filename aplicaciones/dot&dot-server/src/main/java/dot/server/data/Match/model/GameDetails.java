package dot.server.data.Match.model;

import dot.server.data.Definitions.Category;
import dot.server.data.Definitions.Division;
import dot.server.data.MatchDefinitions.entity.City;
import dot.server.data.MatchDefinitions.entity.Competition;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class GameDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToOne
    @JoinColumn(name = "uniqueCode", referencedColumnName = "uniqueCode", unique = true)
    private Game game;

    private Category category;

    private Division division;

    @ManyToOne
    @JoinColumn(name = "competition_id")
    private Competition competition;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @Temporal(TemporalType.DATE)
    private Date date;

}
