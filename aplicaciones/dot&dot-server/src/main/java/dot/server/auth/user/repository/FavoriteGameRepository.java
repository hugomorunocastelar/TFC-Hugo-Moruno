package dot.server.auth.user.repository;

import dot.server.auth.user.model.FavoriteGame;
import dot.server.auth.user.model.User;
import dot.server.data.Match.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteGameRepository extends JpaRepository<FavoriteGame, Long> {

    List<FavoriteGame> findByUserOrderByCreatedAtDesc(User user);

    Optional<FavoriteGame> findByUserAndGame(User user, Game game);

    boolean existsByUserAndGame(User user, Game game);

    void deleteByUserAndGame(User user, Game game);

    @Query("SELECT fg.game FROM FavoriteGame fg WHERE fg.user = :user ORDER BY fg.createdAt DESC")
    List<Game> findGamesByUser(@Param("user") User user);

    long countByUser(User user);
}
