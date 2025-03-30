package dot.server.serverApp.model.Person.entity;

import dot.server.serverApp.model.Club.entity.Team;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 20, nullable = false)
    private String noLicense;

    @Column(length = 3, nullable = false)
    private String lvlLicense;

    @Column(nullable = false)
    private Team idTeam;

    @Column(nullable = false)
    private Person dni;

}
