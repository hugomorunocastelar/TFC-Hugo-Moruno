package dot.server.resources.Person.entity;

import dot.server.resources.Club.entity.Team;
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

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    @OneToOne
    @JoinColumn(name = "person_id", unique = true)
    private Person dni;

}
