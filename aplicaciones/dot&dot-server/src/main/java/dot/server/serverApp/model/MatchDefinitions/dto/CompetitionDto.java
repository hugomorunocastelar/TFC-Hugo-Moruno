package dot.server.serverApp.model.MatchDefinitions.dto;

import dot.server.serverApp.model.MatchDefinitions.entity.Competition;
import lombok.Data;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class CompetitionDto {

    private long id;
    private String name;
    private Date dayStart;
    private Date dayEnd;

    public static CompetitionDto fromEntity(Competition competition) {
        if (competition == null) {
            return null;
        }
        CompetitionDto dto = new CompetitionDto();
        dto.setId(competition.getId());
        dto.setName(competition.getName());
        dto.setDayStart(competition.getDayStart());
        dto.setDayEnd(competition.getDayEnd());
        return dto;
    }

    public static Competition toEntity(CompetitionDto dto) {
        if (dto == null) {
            return null;
        }
        Competition competition = new Competition();
        competition.setId(dto.getId());
        competition.setName(dto.getName());
        competition.setDayStart(dto.getDayStart());
        competition.setDayEnd(dto.getDayEnd());
        return competition;
    }

    public static List<CompetitionDto> fromEntityList(List<Competition> competitions) {
        if (competitions == null) {
            return null;
        }
        return competitions.stream()
                .map(CompetitionDto::fromEntity)
                .collect(Collectors.toList());
    }

    public static List<Competition> toEntityList(List<CompetitionDto> dtos) {
        if (dtos == null) {
            return null;
        }
        return dtos.stream()
                .map(CompetitionDto::toEntity)
                .collect(Collectors.toList());
    }
}
