import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Competitions.css";
import Loader from '../../../Loader/Loader';
import { getAllCompetitions } from '../../../../js/cruds/competition.mjs';
import { getAllLeagues } from '../../../../js/cruds/leagues.mjs';
import { getGamesByLeague } from '../../../../js/home/games.mjs';

function Competitions() {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [gamesData, setGamesData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCompetition, setSelectedCompetition] = useState(null);

  useEffect(() => {
    Promise.all([
      getAllCompetitions(),
      getAllLeagues()
    ]).then(([competitionsData, leaguesData]) => {
      setCompetitions(competitionsData);
      setLeagues(leaguesData);

      const gamesPromises = leaguesData.map(league => 
        getGamesByLeague(league.id)
          .then(games => ({ leagueId: league.id, games }))
          .catch(() => ({ leagueId: league.id, games: [] }))
      );

      return Promise.all(gamesPromises);
    }).then((gamesResults) => {
      const gamesMap = {};
      gamesResults.forEach(({ leagueId, games }) => {
        gamesMap[leagueId] = games;
      });
      setGamesData(gamesMap);
      setLoading(false);
    }).catch((error) => {
      console.error('Error loading competitions:', error);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCDate().toString().padStart(2, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCFullYear()}`;
  };

  const getLeaguesByCompetition = (competitionId) => {
    return leagues.filter(league => league.competition.id === competitionId);
  };

  const groupLeaguesByCategory = (leaguesForComp) => {
    const grouped = {};
    leaguesForComp.forEach(league => {
      if (!grouped[league.category]) {
        grouped[league.category] = [];
      }
      grouped[league.category].push(league);
    });
    return grouped;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'SENIOR': '👤',
      'ABSOLUTE': '🏆',
      'JUNIOR': '🎯',
      'YOUTH': '⚡',
      'CADET': '🔵',
      'INFANTILE': '🟢',
      'ALEVIN': '🟡',
      'BENJAMIN': '🟠',
      'PRE_BENJAMIN': '🔴'
    };
    return icons[category] || '📋';
  };

  const getGamesCountForCategory = (categoryLeagues) => {
    let totalGames = 0;
    categoryLeagues.forEach(league => {
      const games = gamesData[league.id] || [];
      totalGames += games.length;
    });
    return totalGames;
  };

  if (loading) return <Loader />;

  return (
    <div className="competitions-page">
      <div className="competitions-header">
        <h1>Competitions & Leagues</h1>
        <p className="competitions-subtitle">Browse all active competitions and their leagues</p>
      </div>

      <div className="competitions-grid">
        {competitions.map((competition) => {
          const competitionLeagues = getLeaguesByCompetition(competition.id);
          const groupedLeagues = groupLeaguesByCategory(competitionLeagues);
          const isActive = new Date(competition.dayEnd) >= new Date();

          return (
            <div 
              key={competition.id} 
              className={`competition-card ${selectedCompetition === competition.id ? 'expanded' : ''}`}
            >
              <div 
                className="competition-header"
                onClick={() => setSelectedCompetition(selectedCompetition === competition.id ? null : competition.id)}
              >
                <div className="competition-info">
                  <h2 className="competition-name">{competition.name}</h2>
                  <div className="competition-dates">
                    <div className="date-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                      </svg>
                      <span>{formatDate(competition.dayStart)}</span>
                    </div>
                    <span className="date-separator">→</span>
                    <div className="date-item">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
                      </svg>
                      <span>{formatDate(competition.dayEnd)}</span>
                    </div>
                  </div>
                </div>
                <div className="competition-meta">
                  <span className={`status-badge ${isActive ? 'active' : 'ended'}`}>
                    {isActive ? 'Active' : 'Ended'}
                  </span>
                  <span className="leagues-count">{competitionLeagues.length} Leagues</span>
                  <svg 
                    className={`expand-icon ${selectedCompetition === competition.id ? 'expanded' : ''}`}
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="currentColor" 
                    viewBox="0 0 16 16"
                  >
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                  </svg>
                </div>
              </div>

              {selectedCompetition === competition.id && (
                <div className="leagues-container">
                  {Object.entries(groupedLeagues).map(([category, categoryLeagues]) => {
                    const gamesCount = getGamesCountForCategory(categoryLeagues);
                    
                    return (
                      <div key={category} className="category-group">
                        <div className="category-header">
                          <span className="category-icon">{getCategoryIcon(category)}</span>
                          <h3 className="category-title">
                            {category.replace('_', '-')} ({gamesCount} {gamesCount === 1 ? 'game' : 'games'})
                          </h3>
                          <span className="category-count">{categoryLeagues.length}</span>
                        </div>
                        <div className="leagues-list">
                          {categoryLeagues.map((league) => (
                            <div
                              key={league.id}
                              className="league-item"
                              onClick={() => navigate(`/competitions/${competition.name}/${category.toLowerCase()}`)}
                            >
                              <div className="league-info">
                                <span className="league-name">{league.name}</span>
                                <span className="league-code">{league.codePrefix}</span>
                              </div>
                              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                              </svg>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {competitionLeagues.length === 0 && (
                    <div className="no-leagues">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
                      </svg>
                      <p>No leagues available for this competition</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {competitions.length === 0 && (
        <div className="no-competitions">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          </svg>
          <h3>No Competitions Available</h3>
          <p>There are currently no competitions to display.</p>
        </div>
      )}
    </div>
  );
}

export default Competitions;