package dot.server.resources.Person.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.Data;

import java.util.Date;

@Entity
@Data
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 12, unique = true, nullable = false)
    private String dni;

    @Column(length = 20, nullable = false)
    private String name;

    @Column(length = 60, nullable = false)
    private String surnames;

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date birthDate;

    @Column(length = 100)
    private String address;

    @Column(length = 25)
    private String phone;

    @Column(length = 70)
    private String email;

    @Column(nullable = false)
    private Boolean dniVerified;

    @Column(nullable = false)
    private Boolean tutored;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Person tutor;

    @OneToOne(mappedBy = "dni", cascade = CascadeType.ALL)
    private Coach coach;

    @OneToOne(mappedBy = "dni", cascade = CascadeType.ALL)
    private Player player;

    @OneToOne(mappedBy = "dni", cascade = CascadeType.ALL)
    private Referee referee;

}
