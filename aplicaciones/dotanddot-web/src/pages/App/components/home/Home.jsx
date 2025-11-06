import React from 'react'
import "./Home.css";
import OutstandingMatch from './partials/outstandingMatch/OutstandingMatch';
import Ads from './partials/ads/Ads';
import LogoBall from '../../../../components/LogoBall/LogoBall';
import NextMatches from './partials/nextMatches/NextMatches';
import RecentMatches from './partials/recentMatches/RecentMatches';

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
        <Ads />
      </div>
    </div>
  )
}

export default Home