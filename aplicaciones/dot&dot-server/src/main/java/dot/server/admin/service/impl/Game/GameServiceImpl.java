package dot.server.admin.service.impl.Game;

import dot.server.admin.service.Game.GameService;
import dot.server.resources.Match.model.Game;
import dot.server.resources.Match.model.dto.GameDto;
import dot.server.resources.Match.model.dto.GameSummaryDto;
import dot.server.resources.Match.repository.GameRepository;
import dot.server.resources.MatchDefinitions.dao.LeagueDao;
import dot.server.resources.MatchDefinitions.dto.LeagueDto;
import dot.server.resources.MatchDefinitions.entity.League;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final GameRepository repo;
    private final LeagueDao leagueRepository;

    @Override
    public List<GameDto> findAll() {
        return repo.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<GameSummaryDto> findSummerizedAll() {
        return repo.findAll()
                .stream()
                .map(game -> new GameSummaryDto().to(game))
                .collect(Collectors.toList());
    }

    @Override
    public GameSummaryDto getOutstandingMatch() {
        List<Game> games = repo.getOutstandingMatch();
        return new GameSummaryDto().to(games.getFirst());
    }

    @Override
    public Optional<GameDto> findById(Long id) {
        return repo.findById(id).map(this::toDto);
    }

    @Override
    public GameDto create(GameDto gameDto) {
        Game game = new Game();
        fromDto(gameDto, game);
        Game saved = repo.save(game);
        return toDto(saved);
    }

    @Override
    public Optional<GameDto> update(Long id, GameDto gameDto) {
        Optional<Game> optionalGame = repo.findById(id);
        if (optionalGame.isEmpty()) {
            return Optional.empty();
        }
        Game game = optionalGame.get();
        fromDto(gameDto, game);
        Game saved = repo.save(game);
        return Optional.of(toDto(saved));
    }

    @Override
    public boolean delete(Long id) {
        if (!repo.existsById(id)) {
            return false;
        }
        repo.deleteById(id);
        return true;
    }

    private GameDto toDto(Game game) {
        GameDto dto = new GameDto();
        dto.setId(game.getId());
        dto.setUniqueCode(game.getUniqueCode());
        dto.setPlaying(game.isPlaying());
        dto.setFinished(game.isFinished());
        dto.setRelevance(game.getRelevance());
        if (game.getLeague() != null) {
            dto.setLeague(LeagueDto.from(game.getLeague()));
        }
        return dto;
    }

    private void fromDto(GameDto dto, Game game) {
        game.setUniqueCode(dto.getUniqueCode());
        game.setPlaying(dto.isPlaying());
        game.setFinished(dto.isFinished());
        game.setRelevance(dto.getRelevance());

        if (dto.getLeague() != null) {
            League league = leagueRepository.findById(dto.getLeague().getId()).orElse(null);
            game.setLeague(league);
        } else {
            game.setLeague(null);
        }
    }
}
