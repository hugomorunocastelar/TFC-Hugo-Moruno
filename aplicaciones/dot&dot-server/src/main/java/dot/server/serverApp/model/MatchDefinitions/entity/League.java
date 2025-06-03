package dot.server.serverApp.model.MatchDefinitions.entity;

import dot.server.serverApp.model.Definitions.Category;
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

    /**
     * Code prefix to be used in Game.uniqueCode to reference matches of this league.
     * For example: "LV-2024-01"
     */
    @Column(length = 20, unique = true, nullable = false)
    private String codePrefix;

}
