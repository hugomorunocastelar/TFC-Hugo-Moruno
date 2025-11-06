package dot.server.resources.Match.model;

import dot.server.resources.Definitions.Category;
import dot.server.resources.MatchDefinitions.entity.City;
import dot.server.resources.MatchDefinitions.entity.Competition;
import dot.server.resources.Definitions.Division;
import jakarta.persistence.*;
import lombok.Data;

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

}
