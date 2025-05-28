import React from 'react'
import "./Home.css";
import Favorite from './partials/favorite/Favorite';
import RecentMatches from './partials/recentMatches/recentMatches';
import OutstandingMatch from './partials/outstandingMatch/OutstandingMatch';
import Ads from './partials/ads/Ads';
import LogoBall from '../../../../components/LogoBall/LogoBall';
import NextMatches from './partials/nextMatches/NextMatches';

function Home() {
  return (
    <div className='HomeCompPanel'>
      <div className='HCP-Left HCP-Col'>
        <LogoBall />
        <RecentMatches />
        <NextMatches />
      </div>
      <div className='HCP-Right HCP-Col'>
        <OutstandingMatch />
        <Favorite />
        <Ads />
      </div>
    </div>
  )
}

export default Home