package dot.server.referee.service.impl;

import dot.server.data.Match.model.Game;
import dot.server.data.Match.model.GameRefereeTeam;
import dot.server.data.Match.repository.GameRefereeTeamRepository;
import dot.server.referee.service.RefereeGamesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefereeGamesServiceImpl implements RefereeGamesService {

    private final GameRefereeTeamRepository gameRefereeTeamRepository;

    @Override
    public List<Game> getGamesByRefereeId(Long refereeId) {
        return gameRefereeTeamRepository.findAll().stream()
                .filter(refereeTeam -> isRefereeInTeam(refereeTeam, refereeId))
                .map(GameRefereeTeam::getGame)
                .collect(Collectors.toList());
    }

    private boolean isRefereeInTeam(GameRefereeTeam refereeTeam, Long refereeId) {
        return (refereeTeam.getPrincipalReferee() != null && refereeTeam.getPrincipalReferee().getId() == refereeId) ||
               (refereeTeam.getSecondaryReferee() != null && refereeTeam.getSecondaryReferee().getId() == refereeId) ||
               (refereeTeam.getScorer() != null && refereeTeam.getScorer().getId() == refereeId) ||
               (refereeTeam.getLineReferee1() != null && refereeTeam.getLineReferee1().getId() == refereeId) ||
               (refereeTeam.getLineReferee2() != null && refereeTeam.getLineReferee2().getId() == refereeId) ||
               (refereeTeam.getLineReferee3() != null && refereeTeam.getLineReferee3().getId() == refereeId) ||
               (refereeTeam.getLineReferee4() != null && refereeTeam.getLineReferee4().getId() == refereeId);
    }
}
