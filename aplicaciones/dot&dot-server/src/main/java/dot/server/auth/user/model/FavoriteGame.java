package dot.server.auth.user.model;

import dot.server.data.Match.model.Game;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "favorite_games",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "game_id"}))
public class FavoriteGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @CreationTimestamp
    private Instant createdAt;

    public FavoriteGame(User user, Game game) {
        this.user = user;
        this.game = game;
    }
}
