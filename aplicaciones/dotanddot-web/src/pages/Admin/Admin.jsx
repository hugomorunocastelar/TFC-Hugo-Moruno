import React from 'react'
import "./Admin.css";
import SRE from './screen-resolution-error/SRE';
import { Outlet, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';

function Admin() {
  const navigate = useNavigate();

  const pages = {
    Referee: {
      'Referee Games': 'referee-games',
    },

    Data: {
      Person: 'person',
      Referee: 'referee',
      Coach: 'coach',
      Player: 'player',
    },

    Auth: {
      User: 'users',
      Role: 'roles',
    },

    Organization: {
      Game: 'game',
      Team: 'team',
      Club: 'clubs',
      Gameplace: 'gameplace',
      City: 'city',
      League: 'league',
      Season: 'seasons',
      Competition: 'competition',
    }
  };

  function goto(route) {
    navigate(`/admin/${route}`);
  };

  return (
    <div className='AdminPage'>
      <header className='AP-Header'>
        <div>
          <Logo />
          <h1 className='AP-Header-Title'>Administration Panel</h1>
        </div>
        <button className='AP-Header-HomeButton' onClick={() => {navigate('/')}}>
          Back to Home
        </button>
      </header>

      <div className='AdminPage-ScreenResolutionError'>
        <SRE />
      </div>

      <div className='AP-Body'>
        <aside className='AP-Aside'>
          <nav className='AP-Aside-Nav'>
            {Object.entries(pages).map(([groupName, groupPages]) => (
              <div key={groupName} className="AP-Aside-Group">
                <h3 className="AP-Aside-Group-Title">{groupName}</h3>
                {Object.entries(groupPages).map(([label, route]) => (
                  <button
                    key={route}
                    className='AP-Aside-Button'
                    onClick={() => goto(route)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className='AP-Main'>
          <section className="AP-Crud">
            <Outlet />
          </section>
        </main>
      </div>

      <footer className='AP-Footer'>
        <Logo />
        <p> 2025 Admin Panel - All rights reserved</p>
      </footer>
    </div>
  );
}

export default Admin