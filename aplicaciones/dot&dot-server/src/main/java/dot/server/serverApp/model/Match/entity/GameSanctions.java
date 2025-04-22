package dot.server.serverApp.model.Match.entity;

import dot.server.serverApp.model.Club.entity.Team;
import dot.server.serverApp.model.Definitions.SanctionType;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class GameSanctions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "uniqueCode", referencedColumnName = "uniqueCode")
    private Game game;

    @Column(nullable = false)
    private SanctionType type;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(length = 5, nullable = false)
    private String marcador;

}
