package dot.server.data.MatchDefinitions.entity;

import dot.server.data.Definitions.Category;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class League {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(length = 50, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @ManyToOne(optional = false)
    @JoinColumn(name = "competition_id")
    private Competition competition;

    @Column(length = 20, unique = true, nullable = false)
    private String codePrefix;

}
