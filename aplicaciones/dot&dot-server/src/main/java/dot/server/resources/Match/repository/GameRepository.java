package dot.server.resources.Match.repository;

import dot.server.resources.Match.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {

    @Query("""
        SELECT g FROM Game g
        WHERE g.relevance = 1 AND g.finished = false
        ORDER BY g.id DESC
    """)
    List<Game> getOutstandingMatch();
}
