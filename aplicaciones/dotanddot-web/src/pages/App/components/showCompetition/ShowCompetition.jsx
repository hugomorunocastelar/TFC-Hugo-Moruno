import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllLeagues } from '../../../../js/cruds/leagues.mjs';
import { getGamesByLeague } from '../../../../js/home/games.mjs';
import './ShowCompetition.css';
import Loader from '../../../Loader/Loader';
import FavoriteButton from '../../../../components/FavoriteButton/FavoriteButton';

function Competition() {
  const { competition, category } = useParams();
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [gamesData, setGamesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allLeagues = await getAllLeagues();
        
        const filteredLeagues = allLeagues.filter(
          (league) => {
            const competitionMatch = league.competition?.name === competition;
            const categoryMatch = league.category === category.toUpperCase();
            return competitionMatch && categoryMatch;
          }
        );

        setLeagues(filteredLeagues);  

        const gamesPromises = filteredLeagues.map((league) =>
          getGamesByLeague(league.id)
            .then((games) => ({ leagueId: league.id, games }))
            .catch(() => ({ leagueId: league.id, games: [] }))
        );

        const gamesResults = await Promise.all(gamesPromises);
        const gamesMap = {};
        gamesResults.forEach(({ leagueId, games }) => {
          gamesMap[leagueId] = games;
        });

        setGamesData(gamesMap);
      } catch (error) {
        console.error('Error fetching competition data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [competition, category]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      FINISHED: { text: 'Finished', class: 'status-finished' },
      PLAYING: { text: 'Playing', class: 'status-playing' },
      UPCOMING: { text: 'Upcoming', class: 'status-upcoming' },
    };
    return badges[status] || { text: status, class: '' };
  };

  const calculateStandings = (games) => {
    const standings = {};

    games.forEach(game => {
      if (!game.finished || !game.result) return;

      const localTeam = game.initialSituation?.localTeam;
      const visitTeam = game.initialSituation?.visitTeam;

      if (!localTeam || !visitTeam) return;

      
      if (!standings[localTeam.id]) {
        standings[localTeam.id] = {
          name: localTeam.name,
          played: 0,
          won: 0,
          lost: 0,
          setsWon: 0,
          setsLost: 0,
          points: 0
        };
      }
      if (!standings[visitTeam.id]) {
        standings[visitTeam.id] = {
          name: visitTeam.name,
          played: 0,
          won: 0,
          lost: 0,
          setsWon: 0,
          setsLost: 0,
          points: 0
        };
      }

      
      const setsLocal = game.result.setsWonLocal || 0;
      const setsVisit = game.result.setsWonVisit || 0;

      standings[localTeam.id].played++;
      standings[visitTeam.id].played++;
      standings[localTeam.id].setsWon += setsLocal;
      standings[localTeam.id].setsLost += setsVisit;
      standings[visitTeam.id].setsWon += setsVisit;
      standings[visitTeam.id].setsLost += setsLocal;

      if (setsLocal > setsVisit) {
        standings[localTeam.id].won++;
        standings[localTeam.id].points += 3;
        standings[visitTeam.id].lost++;
      } else {
        standings[visitTeam.id].won++;
        standings[visitTeam.id].points += 3;
        standings[localTeam.id].lost++;
      }
    });

    
    return Object.values(standings).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.setsWon - a.setsLost;
      const diffB = b.setsWon - b.setsLost;
      if (diffB !== diffA) return diffB - diffA;
      return b.setsWon - a.setsWon;
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="show-competition-container">
      <div className="competition-header">
        <h1>{competition}</h1>
        <h2>{category}</h2>
      </div>

      {leagues.length === 0 ? (
        <div className="no-data">No leagues found for this competition and category.</div>
      ) : (
        leagues.map((league) => {
          const gamesCount = gamesData[league.id]?.length || 0;
          const standings = gamesData[league.id] ? calculateStandings(gamesData[league.id]) : [];
          
          
          const leagueFilter = filters[league.id] || { status: 'all', team: 'all', startDate: '', endDate: '' };
          
          
          const teams = gamesData[league.id] ? 
            [...new Set(gamesData[league.id].flatMap(game => [
              game.initialSituation?.localTeam?.name,
              game.initialSituation?.visitTeam?.name
            ]).filter(Boolean))].sort() : [];
          
          
          const updateLeagueFilter = (key, value) => {
            setFilters(prev => ({
              ...prev,
              [league.id]: { ...leagueFilter, [key]: value }
            }));
          };
          
          
          const filteredGames = gamesData[league.id] ? gamesData[league.id].filter(game => {
            
            if (leagueFilter.status !== 'all') {
              if (leagueFilter.status === 'finished' && !game.finished) return false;
              if (leagueFilter.status === 'playing' && !game.playing) return false;
              if (leagueFilter.status === 'upcoming' && (game.finished || game.playing)) return false;
            }
            
            
            if (leagueFilter.team !== 'all') {
              const localTeam = game.initialSituation?.localTeam?.name;
              const visitTeam = game.initialSituation?.visitTeam?.name;
              if (localTeam !== leagueFilter.team && visitTeam !== leagueFilter.team) return false;
            }
            
            
            if (leagueFilter.startDate && game.details?.date) {
              const gameDate = new Date(game.details.date).setHours(0, 0, 0, 0);
              const filterDate = new Date(leagueFilter.startDate).setHours(0, 0, 0, 0);
              if (gameDate < filterDate) return false;
            }
            
            
            if (leagueFilter.endDate && game.details?.date) {
              const gameDate = new Date(game.details.date).setHours(0, 0, 0, 0);
              const filterDate = new Date(leagueFilter.endDate).setHours(0, 0, 0, 0);
              if (gameDate > filterDate) return false;
            }
            
            return true;
          }) : [];
          
          return (
          <div key={league.id} className="league-section">
            <h3 className="league-title">{league.name} ({gamesCount} {gamesCount === 1 ? 'game' : 'games'})</h3>
            
            {}
            {standings.length > 0 && (
              <div className="standings-section">
                <h4 className="standings-title">Clasificación</h4>
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th>Pos</th>
                      <th>Equipo</th>
                      <th>PJ</th>
                      <th>PG</th>
                      <th>PP</th>
                      <th>SG</th>
                      <th>SP</th>
                      <th>Dif</th>
                      <th>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, index) => (
                      <tr key={index} className={index < 4 ? 'qualified' : ''}>
                        <td className="position">{index + 1}</td>
                        <td className="team-name">{team.name}</td>
                        <td>{team.played}</td>
                        <td>{team.won}</td>
                        <td>{team.lost}</td>
                        <td>{team.setsWon}</td>
                        <td>{team.setsLost}</td>
                        <td className={team.setsWon - team.setsLost >= 0 ? 'positive' : 'negative'}>
                          {team.setsWon - team.setsLost > 0 ? '+' : ''}{team.setsWon - team.setsLost}
                        </td>
                        <td className="points">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {}
            <div className="filters-section">
              <div className="filter-group">
                <label>Estado:</label>
                <select 
                  value={leagueFilter.status} 
                  onChange={(e) => updateLeagueFilter('status', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos</option>
                  <option value="upcoming">Próximos</option>
                  <option value="playing">En Vivo</option>
                  <option value="finished">Finalizados</option>
                </select>
              </div>
              
              <div className="filter-group">
                <label>Equipo:</label>
                <select 
                  value={leagueFilter.team} 
                  onChange={(e) => updateLeagueFilter('team', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">Todos los equipos</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Desde:</label>
                <input 
                  type="date" 
                  value={leagueFilter.startDate}
                  onChange={(e) => updateLeagueFilter('startDate', e.target.value)}
                  className="filter-date"
                />
              </div>
              
              <div className="filter-group">
                <label>Hasta:</label>
                <input 
                  type="date" 
                  value={leagueFilter.endDate}
                  onChange={(e) => updateLeagueFilter('endDate', e.target.value)}
                  className="filter-date"
                />
              </div>
              
              <button 
                className="filter-reset"
                onClick={() => setFilters(prev => ({ ...prev, [league.id]: { status: 'all', team: 'all', startDate: '', endDate: '' } }))}
              >
                Limpiar
              </button>
            </div>
            
            {filteredGames.length === 0 ? (
              <div className="no-games">
                {gamesData[league.id]?.length === 0 
                  ? 'No games available for this league.' 
                  : 'No se encontraron partidos con los filtros aplicados.'}
              </div>
            ) : (
              <div className="games-grid">
                {filteredGames.map((game) => {
                  const status = game.finished ? 'FINISHED' : (game.playing ? 'PLAYING' : 'UPCOMING');
                  const badge = getStatusBadge(status);
                  
                  
                  const localTeam = game.initialSituation?.localTeam?.name || 'Equipo Local';
                  const visitTeam = game.initialSituation?.visitTeam?.name || 'Equipo Visitante';
                  const date = game.details?.date || '';
                  const city = game.details?.city?.name || 'Ciudad';
                  
                  
                  const setsLocal = game.result?.setsWonLocal || 0;
                  const setsVisit = game.result?.setsWonVisit || 0;
                  
                  return (
                    <div
                      key={game.id}
                      className="game-card"
                      onClick={() => navigate(`/game/${game.id}`)}
                    >
                      <div className="game-card-header">
                        <div className={`status-badge ${badge.class}`}>
                          {badge.text}
                        </div>
                        <FavoriteButton gameId={game.id} size="small" />
                      </div>
                      
                      <div className="game-teams">
                        <div className="team">
                          <span className="team-name">{localTeam}</span>
                          {status === 'FINISHED' && (
                            <span className="team-score">{setsLocal}</span>
                          )}
                        </div>
                        <div className="vs">vs</div>
                        <div className="team">
                          <span className="team-name">{visitTeam}</span>
                          {status === 'FINISHED' && (
                            <span className="team-score">{setsVisit}</span>
                          )}
                        </div>
                      </div>

                      <div className="game-info">
                        <div className="game-date">
                          📅 {formatDate(date)}
                        </div>
                        <div className="game-location">
                          📍 {city}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          );
        })
      )}
    </div>
  );
}

export default Competition;