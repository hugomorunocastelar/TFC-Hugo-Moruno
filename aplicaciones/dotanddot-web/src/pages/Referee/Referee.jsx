import React, { useEffect, useState } from 'react';
import "./Referee.css";
import { Outlet, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo/Logo';
import { validateRole } from '../../js/auth.mjs';

function Referee() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [asideOpen, setAsideOpen] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const adminRole = await validateRole('ROLE_ADMIN');
        setIsAdmin(adminRole);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdminRole();
  }, []);

  const pages = {
    ...(isAdmin && { 'All Games': 'all-games' }),
    ...(!isAdmin && { 'My Games': 'my-games' }),
    Generate: 'generate',
  };

  function goto(route) {
    navigate(`/referee/${route}`);
  };

  return (
    <div className='RefereePage'>
      <header className='REF-Header'>
        <div>
          <Logo />
          <h1 className='REF-Header-Title'>Referee Panel</h1>
        </div>
        <button className='REF-Header-HomeButton' onClick={() => {navigate('/')}}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z"/>
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293z"/>
          </svg>
        </button>
      </header>

      <div className='REF-Body'>
        <button 
          className={`REF-Aside-Toggle ${asideOpen ? 'open' : 'closed'}`}
          onClick={() => setAsideOpen(!asideOpen)}
          aria-label={asideOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
          </svg>
        </button>
        
        <aside className={`REF-Aside ${asideOpen ? 'open' : 'closed'}`}>
          <nav className='REF-Aside-Nav'>
            {Object.entries(pages).map(([label, route]) => (
              <button
                key={route}
                className='REF-Aside-Button'
                onClick={() => goto(route)}
              >
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className='REF-Main'>
          <section className="REF-Crud">
            <Outlet />
          </section>
        </main>
      </div>

      <footer className='REF-Footer'>
        <Logo />
        <p> 2025 Referee Panel - All rights reserved</p>
      </footer>
    </div>
  )
}

export default Referee