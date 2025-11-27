package dot.server.admin.service.impl.Game;

import dot.server.admin.service.Game.GameService;
import dot.server.data.Club.dao.TeamDao;
import dot.server.data.Club.entity.Team;
import dot.server.data.Definitions.Category;
import dot.server.data.Match.model.*;
import dot.server.data.Match.model.dto.GameDto;
import dot.server.data.Match.model.dto.GameSummaryDto;
import dot.server.data.Match.model.dto.request.CreateGameRequest;
import dot.server.data.Match.model.dto.request.UpdateGameRequest;
import dot.server.data.Match.repository.*;
import dot.server.data.MatchDefinitions.dao.CityDao;
import dot.server.data.MatchDefinitions.dao.CompetitionDao;
import dot.server.data.MatchDefinitions.dao.LeagueDao;
import dot.server.data.MatchDefinitions.entity.City;
import dot.server.data.MatchDefinitions.entity.Competition;
import dot.server.data.MatchDefinitions.entity.League;
import dot.server.data.Person.dao.RefereeDao;
import dot.server.data.Person.entity.Referee;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GameServiceImpl implements GameService {

    private final GameRepository gameRepository;
    private final GameDetailsRepository gameDetailsRepository;
    private final GameInitialSituationRepository gameInitialSituationRepository;
    private final GameRefereeTeamRepository gameRefereeTeamRepository;
    private final GameObservationsRepository gameObservationsRepository;
    
    private final LeagueDao leagueRepository;
    private final TeamDao teamRepository;
    private final RefereeDao refereeRepository;
    private final CompetitionDao competitionRepository;
    private final CityDao cityRepository;

    @Override
    public List<GameDto> findAll() {
        return gameRepository.findAll()
                .stream()
                .map(game -> new GameDto().to(game))
                .collect(Collectors.toList());
    }

    @Override
    public List<GameSummaryDto> findSummerizedAll() {
        return gameRepository.findAll()
                .stream()
                .map(game -> new GameSummaryDto().to(game))
                .collect(Collectors.toList());
    }

    @Override
    public GameSummaryDto getOutstandingMatch() {
        List<Game> games = gameRepository.getOutstandingMatch();
        return new GameSummaryDto().to(games.getFirst());
    }

    @Override
    public Optional<GameDto> findById(Long id) {
        return gameRepository.findById(id)
                .map(game -> new GameDto().to(game));
    }
    
    @Override
    public Optional<GameDto> findByUniqueCode(String uniqueCode) {
        return gameRepository.findAll().stream()
                .filter(g -> g.getUniqueCode().equals(uniqueCode))
                .findFirst()
                .map(game -> new GameDto().to(game));
    }

    @Override
    @Transactional
    public GameDto create(CreateGameRequest request) {
        // Generate uniqueCode: CATEGORY-COMPETITION-DATE
        String uniqueCode = generateUniqueCode(request.getCategory(), request.getCompetitionId(), request.getDate());
        
        // Create Game entity
        Game game = new Game();
        game.setUniqueCode(uniqueCode);
        game.setRelevance(request.getRelevance());
        game.setPlaying(false);
        game.setFinished(false);
        
        if (request.getLeagueId() != null) {
            League league = leagueRepository.findById(request.getLeagueId())
                    .orElseThrow(() -> new RuntimeException("League not found"));
            game.setLeague(league);
        }
        
        Game savedGame = gameRepository.save(game);
        
        // Create GameDetails
        if (request.getCategory() != null || request.getDivision() != null || 
            request.getCompetitionId() != null || request.getCityId() != null || request.getDate() != null) {
            
            GameDetails details = new GameDetails();
            details.setGame(savedGame);
            details.setCategory(request.getCategory());
            details.setDivision(request.getDivision());
            details.setDate(request.getDate());
            
            if (request.getCompetitionId() != null) {
                Competition competition = competitionRepository.findById(request.getCompetitionId())
                        .orElseThrow(() -> new RuntimeException("Competition not found"));
                details.setCompetition(competition);
            }
            
            if (request.getCityId() != null) {
                City city = cityRepository.findById(request.getCityId())
                        .orElseThrow(() -> new RuntimeException("City not found"));
                details.setCity(city);
            }
            
            gameDetailsRepository.save(details);
        }
        
        // Create GameInitialSituation
        if (request.getLocalTeamId() != null || request.getVisitTeamId() != null) {
            GameInitialSituation initialSituation = new GameInitialSituation();
            initialSituation.setGame(savedGame);
            
            if (request.getLocalTeamId() != null) {
                Team localTeam = teamRepository.findById(request.getLocalTeamId())
                        .orElseThrow(() -> new RuntimeException("Local team not found"));
                initialSituation.setLocalTeam(localTeam);
            }
            
            if (request.getVisitTeamId() != null) {
                Team visitTeam = teamRepository.findById(request.getVisitTeamId())
                        .orElseThrow(() -> new RuntimeException("Visit team not found"));
                initialSituation.setVisitTeam(visitTeam);
            }
            
            if (request.getStartingTeamId() != null) {
                Team startingTeam = teamRepository.findById(request.getStartingTeamId())
                        .orElse(null);
                initialSituation.setStartingTeam(startingTeam);
            }
            
            if (request.getLeftTeamId() != null) {
                Team leftTeam = teamRepository.findById(request.getLeftTeamId())
                        .orElse(null);
                initialSituation.setLeftTeam(leftTeam);
            }
            
            gameInitialSituationRepository.save(initialSituation);
        }
        
        // Create GameRefereeTeam
        if (request.getPrincipalRefereeId() != null || request.getScorerId() != null) {
            GameRefereeTeam refereeTeam = new GameRefereeTeam();
            refereeTeam.setGame(savedGame);
            
            if (request.getPrincipalRefereeId() != null) {
                Referee principal = refereeRepository.findById(request.getPrincipalRefereeId())
                        .orElseThrow(() -> new RuntimeException("Principal referee not found"));
                refereeTeam.setPrincipalReferee(principal);
            }
            
            if (request.getSecondaryRefereeId() != null) {
                Referee secondary = refereeRepository.findById(request.getSecondaryRefereeId())
                        .orElse(null);
                refereeTeam.setSecondaryReferee(secondary);
            }
            
            if (request.getScorerId() != null) {
                Referee scorer = refereeRepository.findById(request.getScorerId())
                        .orElseThrow(() -> new RuntimeException("Scorer not found"));
                refereeTeam.setScorer(scorer);
            }
            
            if (request.getLineReferee1Id() != null) {
                Referee line1 = refereeRepository.findById(request.getLineReferee1Id())
                        .orElse(null);
                refereeTeam.setLineReferee1(line1);
            }
            
            if (request.getLineReferee2Id() != null) {
                Referee line2 = refereeRepository.findById(request.getLineReferee2Id())
                        .orElse(null);
                refereeTeam.setLineReferee2(line2);
            }
            
            if (request.getLineReferee3Id() != null) {
                Referee line3 = refereeRepository.findById(request.getLineReferee3Id())
                        .orElse(null);
                refereeTeam.setLineReferee3(line3);
            }
            
            if (request.getLineReferee4Id() != null) {
                Referee line4 = refereeRepository.findById(request.getLineReferee4Id())
                        .orElse(null);
                refereeTeam.setLineReferee4(line4);
            }
            
            gameRefereeTeamRepository.save(refereeTeam);
        }
        
        // Create GameObservations
        if (request.getObservations() != null && !request.getObservations().isEmpty()) {
            GameObservations observations = new GameObservations();
            observations.setGame(savedGame);
            observations.setObservations(request.getObservations());
            gameObservationsRepository.save(observations);
        }
        
        // Reload game with all relationships
        Game completeGame = gameRepository.findById(savedGame.getId())
                .orElseThrow(() -> new RuntimeException("Error loading created game"));
        
        return new GameDto().to(completeGame);
    }

    @Override
    @Transactional
    public Optional<GameDto> update(Long id, UpdateGameRequest request) {
        Optional<Game> optionalGame = gameRepository.findById(id);
        if (optionalGame.isEmpty()) {
            return Optional.empty();
        }
        
        Game game = optionalGame.get();
        
        // Update Game basic fields
        game.setRelevance(request.getRelevance());
        
        if (request.getPlaying() != null) {
            game.setPlaying(request.getPlaying());
        }
        if (request.getFinished() != null) {
            game.setFinished(request.getFinished());
        }
        
        if (request.getLeagueId() != null) {
            League league = leagueRepository.findById(request.getLeagueId())
                    .orElseThrow(() -> new RuntimeException("League not found"));
            game.setLeague(league);
        }
        
        gameRepository.save(game);
        
        // Update GameDetails
        GameDetails details = game.getDetails();
        if (details == null && (request.getCategory() != null || request.getDivision() != null || 
            request.getCompetitionId() != null || request.getCityId() != null || request.getDate() != null)) {
            details = new GameDetails();
            details.setGame(game);
        }
        
        if (details != null) {
            boolean needsUniqueCodeUpdate = false;
            Category oldCategory = details.getCategory();
            Competition oldCompetition = details.getCompetition();
            Date oldDate = details.getDate();
            
            if (request.getCategory() != null && request.getCategory() != oldCategory) {
                details.setCategory(request.getCategory());
                needsUniqueCodeUpdate = true;
            }
            if (request.getDivision() != null) {
                details.setDivision(request.getDivision());
            }
            
            if (request.getCompetitionId() != null) {
                Competition competition = competitionRepository.findById(request.getCompetitionId())
                        .orElseThrow(() -> new RuntimeException("Competition not found"));
                if (oldCompetition == null || !oldCompetition.getId().equals(competition.getId())) {
                    details.setCompetition(competition);
                    needsUniqueCodeUpdate = true;
                }
            }
            
            if (request.getCityId() != null) {
                City city = cityRepository.findById(request.getCityId())
                        .orElseThrow(() -> new RuntimeException("City not found"));
                details.setCity(city);
            }
            
            if (request.getDate() != null && !request.getDate().equals(oldDate)) {
                details.setDate(request.getDate());
                needsUniqueCodeUpdate = true;
            }
            
            // Regenerate uniqueCode if relevant fields changed
            if (needsUniqueCodeUpdate) {
                String newUniqueCode = generateUniqueCode(
                    details.getCategory(), 
                    details.getCompetition() != null ? details.getCompetition().getId() : null,
                    details.getDate()
                );
                game.setUniqueCode(newUniqueCode);
                gameRepository.save(game);
            }
            
            gameDetailsRepository.save(details);
        }
        
        // Update GameInitialSituation
        GameInitialSituation initialSituation = game.getInitialSituation();
        if (initialSituation == null && (request.getLocalTeamId() != null || request.getVisitTeamId() != null)) {
            initialSituation = new GameInitialSituation();
            initialSituation.setGame(game);
        }
        
        if (initialSituation != null) {
            if (request.getLocalTeamId() != null) {
                Team localTeam = teamRepository.findById(request.getLocalTeamId())
                        .orElseThrow(() -> new RuntimeException("Local team not found"));
                initialSituation.setLocalTeam(localTeam);
            }
            
            if (request.getVisitTeamId() != null) {
                Team visitTeam = teamRepository.findById(request.getVisitTeamId())
                        .orElseThrow(() -> new RuntimeException("Visit team not found"));
                initialSituation.setVisitTeam(visitTeam);
            }
            
            if (request.getStartingTeamId() != null) {
                Team startingTeam = teamRepository.findById(request.getStartingTeamId())
                        .orElse(null);
                initialSituation.setStartingTeam(startingTeam);
            }
            
            if (request.getLeftTeamId() != null) {
                Team leftTeam = teamRepository.findById(request.getLeftTeamId())
                        .orElse(null);
                initialSituation.setLeftTeam(leftTeam);
            }
            
            gameInitialSituationRepository.save(initialSituation);
        }
        
        // Update GameRefereeTeam
        GameRefereeTeam refereeTeam = game.getRefereeTeam();
        if (refereeTeam == null && (request.getPrincipalRefereeId() != null || request.getScorerId() != null)) {
            refereeTeam = new GameRefereeTeam();
            refereeTeam.setGame(game);
        }
        
        if (refereeTeam != null) {
            if (request.getPrincipalRefereeId() != null) {
                Referee principal = refereeRepository.findById(request.getPrincipalRefereeId())
                        .orElseThrow(() -> new RuntimeException("Principal referee not found"));
                refereeTeam.setPrincipalReferee(principal);
            }
            
            if (request.getSecondaryRefereeId() != null) {
                Referee secondary = refereeRepository.findById(request.getSecondaryRefereeId())
                        .orElse(null);
                refereeTeam.setSecondaryReferee(secondary);
            }
            
            if (request.getScorerId() != null) {
                Referee scorer = refereeRepository.findById(request.getScorerId())
                        .orElseThrow(() -> new RuntimeException("Scorer not found"));
                refereeTeam.setScorer(scorer);
            }
            
            if (request.getLineReferee1Id() != null) {
                Referee line1 = refereeRepository.findById(request.getLineReferee1Id())
                        .orElse(null);
                refereeTeam.setLineReferee1(line1);
            }
            
            if (request.getLineReferee2Id() != null) {
                Referee line2 = refereeRepository.findById(request.getLineReferee2Id())
                        .orElse(null);
                refereeTeam.setLineReferee2(line2);
            }
            
            if (request.getLineReferee3Id() != null) {
                Referee line3 = refereeRepository.findById(request.getLineReferee3Id())
                        .orElse(null);
                refereeTeam.setLineReferee3(line3);
            }
            
            if (request.getLineReferee4Id() != null) {
                Referee line4 = refereeRepository.findById(request.getLineReferee4Id())
                        .orElse(null);
                refereeTeam.setLineReferee4(line4);
            }
            
            gameRefereeTeamRepository.save(refereeTeam);
        }
        
        // Update GameObservations
        GameObservations observations = game.getObservation();
        if (observations == null && request.getObservations() != null && !request.getObservations().isEmpty()) {
            observations = new GameObservations();
            observations.setGame(game);
        }
        
        if (observations != null && request.getObservations() != null) {
            observations.setObservations(request.getObservations());
            gameObservationsRepository.save(observations);
        }
        
        // Reload game with all relationships
        Game updatedGame = gameRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Error loading updated game"));
        
        return Optional.of(new GameDto().to(updatedGame));
    }

    @Override
    @Transactional
    public boolean delete(Long id) {
        if (!gameRepository.existsById(id)) {
            return false;
        }
        
        Game game = gameRepository.findById(id).orElse(null);
        if (game == null) {
            return false;
        }
        
        // Delete related entities first
        if (game.getObservation() != null) {
            gameObservationsRepository.delete(game.getObservation());
        }
        if (game.getRefereeTeam() != null) {
            gameRefereeTeamRepository.delete(game.getRefereeTeam());
        }
        if (game.getInitialSituation() != null) {
            gameInitialSituationRepository.delete(game.getInitialSituation());
        }
        if (game.getDetails() != null) {
            gameDetailsRepository.delete(game.getDetails());
        }
        
        gameRepository.deleteById(id);
        return true;
    }
    
    /**
     * Generate unique code based on Category, Competition name, and Date
     * Format: CATEGORY-COMPETITION-YYYYMMDD
     * Example: ALEVIN-CAMPEONATO_EXTREMADURA-20251127
     */
    private String generateUniqueCode(Category category, Long competitionId, Date date) {
        StringBuilder code = new StringBuilder();
        
        // Add category (uppercase)
        if (category != null) {
            code.append(category.name());
        } else {
            code.append("UNKNOWN");
        }
        
        code.append("-");
        
        // Add competition name (uppercase, spaces replaced with underscores)
        if (competitionId != null) {
            Competition competition = competitionRepository.findById(competitionId).orElse(null);
            if (competition != null) {
                String competitionName = competition.getName()
                        .toUpperCase()
                        .replaceAll("\\s+", "_")
                        .replaceAll("[^A-Z0-9_]", "");
                code.append(competitionName);
            } else {
                code.append("NOCOMPETITION");
            }
        } else {
            code.append("NOCOMPETITION");
        }
        
        code.append("-");
        
        // Add date in YYYYMMDD format
        if (date != null) {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
            code.append(dateFormat.format(date));
        } else {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
            code.append(dateFormat.format(new Date()));
        }
        
        // Add counter if code already exists
        String baseCode = code.toString();
        String finalCode = baseCode;
        int counter = 1;
        
        while (gameRepository.findAll().stream().anyMatch(g -> g.getUniqueCode().equals(finalCode))) {
            finalCode = baseCode + "_" + counter;
            counter++;
        }
        
        return finalCode;
    }
}
