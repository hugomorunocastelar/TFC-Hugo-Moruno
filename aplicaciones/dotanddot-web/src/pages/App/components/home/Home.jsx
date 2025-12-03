import React, { useEffect, useState } from 'react'
import "./Home.css";
import OutstandingMatch from './partials/outstandingMatch/OutstandingMatch';
import Ads from './partials/ads/Ads';
import LogoBall from '../../../../components/LogoBall/LogoBall';
import NextMatches from './partials/nextMatches/NextMatches';
import RecentMatches from './partials/recentMatches/RecentMatches';
import Loader from '../../../Loader/Loader';
import { getAllOpenGames, getOutstandingMatch } from '../../../../js/home/games.mjs';

function Home() {

  const [games, setGames] = useState();
  const [outstandingMatch, setOutstandingMatch] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllOpenGames(),
      getOutstandingMatch()
    ]).then(([gamesData, matchData]) => {
      setGames(gamesData);
      setOutstandingMatch(matchData);
      setLoading(false);
    }).catch((error) => {
      console.error('Error loading data:', error);
      setLoading(false);
    });
  }, []);


  return (
    <div className='HomeCompPanel'>
      <div className='HCP-Left HCP-Col'>
        <LogoBall />
        {loading ? (
          <Loader />
        ) : (
          <>
            <RecentMatches matches={games}/>
            <NextMatches matches={games}/>
          </>
        )}
      </div>
      <div className='HCP-Right HCP-Col'>
        <OutstandingMatch match={outstandingMatch} />
        <Ads />
      </div>
    </div>
  )
}

export default Home