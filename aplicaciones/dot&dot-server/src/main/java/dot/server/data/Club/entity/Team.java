package dot.server.data.Club.entity;

import dot.server.data.Definitions.Category;
import dot.server.data.Person.entity.Person;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50, nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "dni_captain_id", nullable = false)
    private Person dniCaptain;

    @ManyToOne
    @JoinColumn(name = "id_club_id", nullable = false)
    private Club idClub;

    @Column(nullable = false)
    private Category category;

}
