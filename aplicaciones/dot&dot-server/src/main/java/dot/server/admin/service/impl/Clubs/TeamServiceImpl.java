package dot.server.admin.service.impl.Clubs;

import dot.server.admin.service.Clubs.TeamService;
import dot.server.resources.Club.dao.TeamDao;
import dot.server.resources.Club.dto.TeamDto;
import dot.server.resources.Club.entity.Team;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamServiceImpl implements TeamService {

    private final TeamDao teamDao;

    public TeamServiceImpl(TeamDao teamDao) {
        this.teamDao = teamDao;
    }

    @Override
    public Optional<TeamDto> getTeamById(Long id) {
        return teamDao.findById(id).map(TeamDto::from);
    }

    @Override
    public List<TeamDto> getAllTeams() {
        return TeamDto.from(teamDao.findAll());
    }

    @Override
    public TeamDto createTeam(TeamDto teamDto) {
        Team team = TeamDto.to(teamDto);
        return TeamDto.from(teamDao.save(team));
    }

    @Override
    public TeamDto updateTeam(Long id, TeamDto teamDto) {
        if (!teamDao.existsById(id)) {
            throw new RuntimeException("Team not found");
        }

        Team team = TeamDto.to(teamDto);
        team.setId(id);
        return TeamDto.from(teamDao.save(team));
    }

    @Override
    public void deleteTeam(Long id) {
        teamDao.deleteById(id);
    }
}
