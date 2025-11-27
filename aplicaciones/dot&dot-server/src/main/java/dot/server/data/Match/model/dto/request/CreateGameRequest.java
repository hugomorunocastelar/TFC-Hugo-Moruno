package dot.server.data.Match.model.dto.request;

import dot.server.data.Definitions.Category;
import dot.server.data.Definitions.Division;
import lombok.Data;

import java.util.Date;

@Data
public class CreateGameRequest {
    private int relevance;
    private Long leagueId;
    
    // Game Details
    private Category category;
    private Division division;
    private Long competitionId;
    private Long cityId;
    private Date date;
    
    // Initial Situation
    private Long localTeamId;
    private Long visitTeamId;
    private Long startingTeamId;
    private Long leftTeamId;
    
    // Referee Team
    private Long principalRefereeId;
    private Long secondaryRefereeId;
    private Long scorerId;
    private Long lineReferee1Id;
    private Long lineReferee2Id;
    private Long lineReferee3Id;
    private Long lineReferee4Id;
    
    // Observations (optional)
    private String observations;
}
