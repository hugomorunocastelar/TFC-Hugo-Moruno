package dot.server.serverApp.model.Club.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Club {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50, nullable = false)
    private String name;

//    @Column(nullable = false)
//    private City idCity;

}
