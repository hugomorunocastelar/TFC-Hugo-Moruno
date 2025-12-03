package dot.server.data.Match.service.impl;

import dot.server.data.Match.model.dto.GameSummaryDto;
import dot.server.data.Match.repository.GameRepository;
import dot.server.data.Match.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchServiceImpl implements MatchService {

    private final GameRepository gameRepository;

    @Override
    public List<GameSummaryDto> getGamesByLeague(Long leagueId) {
        return gameRepository.findByLeagueId(leagueId)
                .stream()
                .map(game -> new GameSummaryDto().to(game))
                .collect(Collectors.toList());
    }

    @Override
    public List<GameSummaryDto> getGamesByCompetition(Long competitionId) {
        return gameRepository.findByCompetitionId(competitionId)
                .stream()
                .map(game -> new GameSummaryDto().to(game))
                .collect(Collectors.toList());
    }
}
