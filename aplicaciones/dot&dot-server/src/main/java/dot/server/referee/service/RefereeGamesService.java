package dot.server.referee.service;

import dot.server.data.Match.model.Game;

import java.util.List;

public interface RefereeGamesService {
    
    /**
     * Get all games where the referee with the given ID is assigned to any referee position
     * @param refereeId The ID of the referee
     * @return List of games where the referee is assigned
     */
    List<Game> getGamesByRefereeId(Long refereeId);
}
