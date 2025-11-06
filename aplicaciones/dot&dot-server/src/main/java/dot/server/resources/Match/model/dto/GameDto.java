package dot.server.resources.Match.model.dto;

import dot.server.resources.Match.model.Game;
import dot.server.resources.Match.model.dto.withoutGame.GameInitialSituationWOUTDto;
import dot.server.resources.Match.model.dto.withoutGame.GameResultWOUTDto;
import dot.server.resources.MatchDefinitions.dto.LeagueDto;
import lombok.Data;

import java.util.List;

@Data
public class GameDto implements DtoMapper<Game, GameDto> {

    private long id;
    private String uniqueCode;
    private GameDetailsDto details;
    private GameInitialSituationWOUTDto initialSituation;
    private GameRefereeTeamDto refereeTeam;
    private GameObservationsDto observation;
    private List<GameSanctionsDto> sanctionsList;
    private List<GameSetDto> sets;
    private GameResultWOUTDto result;
    private boolean playing;
    private boolean finished;
    private int relevance;
    private LeagueDto league;

    @Override
    public GameDto to(Game entity) {
        if (entity == null) return null;
        GameDto dto = new GameDto();
        dto.setId(entity.getId());
        dto.setUniqueCode(entity.getUniqueCode());
        dto.setDetails(new GameDetailsDto().to(entity.getDetails()));
        dto.setInitialSituation(new GameInitialSituationWOUTDto().to(entity.getInitialSituation()));
        dto.setRefereeTeam(new GameRefereeTeamDto().to(entity.getRefereeTeam()));
        dto.setObservation(new GameObservationsDto().to(entity.getObservation()));
        dto.setSanctionsList(new GameSanctionsDto().to(entity.getSanctionsList()));
        dto.setSets(new GameSetDto().to(entity.getSets()));
        dto.setResult(new GameResultWOUTDto().to(entity.getResult()));
        dto.setPlaying(entity.isPlaying());
        dto.setFinished(entity.isFinished());
        dto.setRelevance(entity.getRelevance());
        dto.setLeague(LeagueDto.from(entity.getLeague()));
        return dto;
    }

    @Override
    public Game from(GameDto dto) {
        if (dto == null) return null;
        Game entity = new Game();
        if (dto.getId() != 0) {
            entity.setId(dto.getId());
        }
        entity.setUniqueCode(dto.getUniqueCode());
        entity.setDetails(new GameDetailsDto().from(dto.getDetails()));
        entity.setInitialSituation(new GameInitialSituationWOUTDto().from(dto.getInitialSituation()));
        entity.setRefereeTeam(new GameRefereeTeamDto().from(dto.getRefereeTeam()));
        entity.setObservation(new GameObservationsDto().from(dto.getObservation()));
        entity.setSanctionsList(new GameSanctionsDto().from(dto.getSanctionsList()));
        entity.setSets(new GameSetDto().from(dto.getSets()));
        entity.setResult(new GameResultWOUTDto().from(dto.getResult()));
        entity.setPlaying(dto.isPlaying());
        entity.setFinished(dto.isFinished());
        entity.setRelevance(dto.getRelevance());
        entity.setLeague(LeagueDto.to(dto.getLeague()));
        return entity;
    }
}
