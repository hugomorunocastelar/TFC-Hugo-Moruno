package dot.server.data.Match.model.dto;

import dot.server.data.Match.model.GameRefereeTeam;
import dot.server.data.Person.dto.RefereeDTO;
import lombok.Data;

@Data
public class GameRefereeTeamDto implements DtoMapper<GameRefereeTeam, GameRefereeTeamDto> {

    private long id;
    private RefereeDTO principalReferee;
    private RefereeDTO secondaryReferee;
    private RefereeDTO scorer;
    private RefereeDTO lineReferee1;
    private RefereeDTO lineReferee2;
    private RefereeDTO lineReferee3;
    private RefereeDTO lineReferee4;

    @Override
    public GameRefereeTeamDto to(GameRefereeTeam entity) {
        if (entity == null) return null;
        GameRefereeTeamDto dto = new GameRefereeTeamDto();
        dto.setId(entity.getId());
        dto.setPrincipalReferee(RefereeDTO.from(entity.getPrincipalReferee()));
        dto.setSecondaryReferee(RefereeDTO.from(entity.getSecondaryReferee()));
        dto.setScorer(RefereeDTO.from(entity.getScorer()));
        dto.setLineReferee1(RefereeDTO.from(entity.getLineReferee1()));
        dto.setLineReferee2(RefereeDTO.from(entity.getLineReferee2()));
        dto.setLineReferee3(RefereeDTO.from(entity.getLineReferee3()));
        dto.setLineReferee4(RefereeDTO.from(entity.getLineReferee4()));
        return dto;
    }

    @Override
    public GameRefereeTeam from(GameRefereeTeamDto dto) {
        if (dto == null) return null;
        GameRefereeTeam entity = new GameRefereeTeam();
        entity.setId(dto.getId());
        entity.setPrincipalReferee(RefereeDTO.to(dto.getPrincipalReferee()));
        entity.setSecondaryReferee(RefereeDTO.to(dto.getSecondaryReferee()));
        entity.setScorer(RefereeDTO.to(dto.getScorer()));
        entity.setLineReferee1(RefereeDTO.to(dto.getLineReferee1()));
        entity.setLineReferee2(RefereeDTO.to(dto.getLineReferee2()));
        entity.setLineReferee3(RefereeDTO.to(dto.getLineReferee3()));
        entity.setLineReferee4(RefereeDTO.to(dto.getLineReferee4()));
        return entity;
    }
}
