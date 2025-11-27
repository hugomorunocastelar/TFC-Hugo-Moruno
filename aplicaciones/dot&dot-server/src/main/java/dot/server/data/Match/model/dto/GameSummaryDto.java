package dot.server.data.Match.model.dto;

import dot.server.data.Match.model.Game;
import dot.server.data.Match.model.dto.withoutGame.GameInitialSituationWOUTDto;
import dot.server.data.Match.model.dto.withoutGame.GameResultWOUTDto;
import dot.server.data.MatchDefinitions.dto.LeagueDto;
import lombok.Data;

@Data
public class GameSummaryDto implements DtoMapper<Game, GameSummaryDto> {
    private long id;
    private String uniqueCode;
    private GameInitialSituationWOUTDto initialSituation;
    private GameResultWOUTDto result;
    private boolean playing;
    private boolean finished;
    private int relevance;
    private LeagueDto league;

    @Override
    public GameSummaryDto to(Game entity) {
        if (entity == null) return null;
        GameSummaryDto dto = new GameSummaryDto();
        dto.setId(entity.getId());
        dto.setUniqueCode(entity.getUniqueCode());
        dto.setResult(new GameResultWOUTDto().to(entity.getResult()));
        dto.setInitialSituation(new GameInitialSituationWOUTDto().to(entity.getInitialSituation()));
        dto.setPlaying(entity.isPlaying());
        dto.setFinished(entity.isFinished());
        dto.setRelevance(entity.getRelevance());
        dto.setLeague(LeagueDto.from(entity.getLeague()));
        return dto;
    }

    @Override
    public Game from(GameSummaryDto dto) {
        if (dto == null) return null;
        Game entity = new Game();
        if (dto.getId() != 0) {
            entity.setId(dto.getId());
        }
        entity.setUniqueCode(dto.getUniqueCode());
        entity.setResult(new GameResultWOUTDto().from(dto.getResult()));
        entity.setInitialSituation(new GameInitialSituationWOUTDto().from(dto.getInitialSituation()));
        entity.setPlaying(dto.isPlaying());
        entity.setFinished(dto.isFinished());
        entity.setRelevance(dto.getRelevance());
        entity.setLeague(LeagueDto.to(dto.getLeague()));
        return entity;
    }
}