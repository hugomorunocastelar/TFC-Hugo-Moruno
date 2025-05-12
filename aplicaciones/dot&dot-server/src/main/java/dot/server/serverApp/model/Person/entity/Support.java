package dot.server.serverApp.model.Person.entity;

import dot.server.serverApp.model.Club.entity.Team;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Support {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 20, nullable = false)
    private String noLicense;

    @Column(length = 30, nullable = false)
    private String purpose;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToOne
    @JoinColumn(name = "person_id", unique = true)
    private Person dni;

}
