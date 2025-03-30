package dot.server.serverApp.model.Person.entity;

import dot.server.serverApp.model.Club.entity.Team;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private int noShirt;

    @Column(nullable = false)
    private Team idTeam;

    @Column(nullable = false)
    private Person dni;

}
