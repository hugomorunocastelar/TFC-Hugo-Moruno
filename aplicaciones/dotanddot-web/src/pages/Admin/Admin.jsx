import React from 'react'
import "./Admin.css";
import SRE from './screen-resolution-error/SRE';
import { Outlet, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';

function Admin() {
  const navigate = useNavigate();

  const pages = {
    Person: 'person',
    Referee: 'referee',
    Coach: 'coach',
    Player: 'player',
    User: 'users',
    Role: 'roles',
    Club: 'clubs',
    City: 'city',
    League: 'league',
    Competition: 'competition',
    Team: 'team',
    Gameplace: 'gameplace',
    Season: 'seasons',
    Game: 'game'
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
            {Object.entries(pages).map(([label, route]) => (
              <button
                key={route}
                className='AP-Aside-Button'
                onClick={() => goto(route)}
              >
                {label}
              </button>
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
        <p> 2025 Admin Panel - Todos los derechos reservados</p>
      </footer>
    </div>
  );
}

export default Admin