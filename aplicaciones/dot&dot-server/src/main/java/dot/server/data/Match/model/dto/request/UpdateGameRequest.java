package dot.server.data.Match.model.dto.request;

import dot.server.data.Definitions.Category;
import dot.server.data.Definitions.Division;
import lombok.Data;

import java.util.Date;

@Data
public class UpdateGameRequest {
    private int relevance;
    private Long leagueId;
    
    
    private Category category;
    private Division division;
    private Long competitionId;
    private Long cityId;
    private Date date;
    
    
    private Long localTeamId;
    private Long visitTeamId;
    private Long startingTeamId;
    private Long leftTeamId;
    
    
    private Long principalRefereeId;
    private Long secondaryRefereeId;
    private Long scorerId;
    private Long lineReferee1Id;
    private Long lineReferee2Id;
    private Long lineReferee3Id;
    private Long lineReferee4Id;
    
    
    private String observations;
    
    
    private Boolean playing;
    private Boolean finished;
}
