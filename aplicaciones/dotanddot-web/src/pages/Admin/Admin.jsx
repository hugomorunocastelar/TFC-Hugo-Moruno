import React from 'react'
import "./Admin.css";
import SRE from './screen-resolution-error/SRE';

function Admin() {
  return (
    <div className='AdminPage'>
      <header className='AP-Header'>
        
      </header>
      <div className='AdminPage-ScreenResolutionError'>
        <SRE />
      </div>
    </div>
  )
}

export default Admin