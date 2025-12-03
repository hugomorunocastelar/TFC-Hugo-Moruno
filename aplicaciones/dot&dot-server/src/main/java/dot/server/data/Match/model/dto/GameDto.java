package dot.server.data.Match.model.dto;

import dot.server.data.Match.model.Game;
import dot.server.data.Match.model.dto.withoutGame.GameInitialSituationWOUTDto;
import dot.server.data.Match.model.dto.withoutGame.GameResultWOUTDto;
import dot.server.data.MatchDefinitions.dto.LeagueDto;
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
    private GameSetDto set1;
    private GameSetDto set2;
    private GameSetDto set3;
    private GameSetDto set4;
    private GameSetDto set5;
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
        dto.setSet1(new GameSetDto().to(entity.getSet1()));
        dto.setSet2(new GameSetDto().to(entity.getSet2()));
        dto.setSet3(new GameSetDto().to(entity.getSet3()));
        dto.setSet4(new GameSetDto().to(entity.getSet4()));
        dto.setSet5(new GameSetDto().to(entity.getSet5()));
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
        
        entity.setResult(new GameResultWOUTDto().from(dto.getResult()));
        entity.setPlaying(dto.isPlaying());
        entity.setFinished(dto.isFinished());
        entity.setRelevance(dto.getRelevance());
        entity.setLeague(LeagueDto.to(dto.getLeague()));
        return entity;
    }
}
