package dot.server.data.Match.service;

import dot.server.data.Match.model.dto.GameSummaryDto;

import java.util.List;

public interface MatchService {
    List<GameSummaryDto> getGamesByLeague(Long leagueId);
    List<GameSummaryDto> getGamesByCompetition(Long competitionId);
}
