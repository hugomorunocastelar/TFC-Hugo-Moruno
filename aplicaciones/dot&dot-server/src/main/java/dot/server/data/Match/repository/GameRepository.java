package dot.server.data.Match.repository;

import dot.server.data.Match.model.Game;
import dot.server.data.MatchDefinitions.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {

    @Query("""
                SELECT g FROM Game g
                WHERE g.relevance = 1 AND g.finished = false
                ORDER BY g.id DESC
            """)
    List<Game> getOutstandingMatch();

    @Query("""
                SELECT g FROM Game g
                WHERE g.league.id = :leagueId
                ORDER BY g.details.date DESC, g.details.timeStart DESC
            """)
    List<Game> findByLeagueId(@Param("leagueId") Long leagueId);

    @Query("""
                SELECT g FROM Game g
                WHERE g.league.competition.id = :competitionId
                ORDER BY g.details.date DESC, g.details.timeStart DESC
            """)
    List<Game> findByCompetitionId(@Param("competitionId") Long competitionId);
}
