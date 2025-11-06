package dot.server.serverApp.admin.service;

import dot.server.serverApp.model.Club.dto.TeamDto;

import java.util.List;
import java.util.Optional;

public interface TeamService {

    TeamDto createTeam(TeamDto teamDto);
    Optional<TeamDto> getTeamById(Long id);
    List<TeamDto> getAllTeams();
    TeamDto updateTeam(Long id, TeamDto teamDto);
    void deleteTeam(Long id);
}
