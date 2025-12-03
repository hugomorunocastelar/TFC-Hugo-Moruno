import { useEffect, useState } from 'react'
import './App.css'
import Logo from '../../components/Logo/Logo'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import * as session from "../../js/session.mjs";
import { validateSession } from '../../js/auth.mjs';

function App() {

  const sessionUser = session.getSession();

  const [selectedOption, setSelectedOption] = useState('home');
  const [isLogged, setLogged] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isReferee, setReferee] = useState(false);
  const [username, setUsername] = useState();
  const [user, setUser] = useState({});
  
  const navigate = useNavigate();
  
  const options = {
    'home': '/',
    'matches': '/matches',
    'competitions': '/competitions',
    'clubs': '/clubs',
    'referee':'/referee',
    'admin': '/admin'
  }
  
  useEffect(() => {
    if (session.getSession() != null) {
      console.log("Validating session...");
      validateSession().then((result) => {
        console.log("Session validation result:", result);
        if (result) {
          const userData = session.getSession();
          setUser(userData);
          setUsername(userData.username);
          setAdmin(userData.roles.includes('ROLE_ADMIN'));
          setReferee(userData.roles.includes('ROLE_REFEREE')||userData.roles.includes('ROLE_ADMIN'));
          setLogged(true);
        }
      })
    }
  }, []);

  function gotoMenu(option) {
    if (option != '' && option != null && option != undefined) {
      setSelectedOption(option);
      navigate(options[option]);
    }
  }

  return (
    <>
      <div className='HomePanel'>
        <header className='HP-Header'>
          <div className='HP-Header-Content'>
            <div className='HP-Head'>
              <Logo />
              <h1>Built by a Voleyball Fan</h1>
              <div className='HP-Utilities'>
                { isLogged ? 
                  (
                    <>
                      <button onClick={() => navigate('/favorites')} title="My Favorites">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                      </button>
                      <button onClick={() => {navigate('/contact'); setSelectedOption('')}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247m2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z"/>
                        </svg>
                      </button>
                      <button onClick={() => navigate('/profile')} className='LoggedButton'>
                        <p>{username.toUpperCase()}</p>
                        {sessionUser.avatar ? (
                          <img src={sessionUser.avatar} alt="Profile Picture" className="profile-pic" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                          </svg>
                        )}
                      </button>
                    </>
                  ) : (
                    <button onClick={() => {navigate('/login')}}>
                      Login
                    </button>
                  )
                }
                
              </div>
            </div>
            <div className='HP-Buttons'>
              <div className='HP-Buttons-Commons'>
                {Object.entries(options)
                  .filter(([key]) => key !== 'admin' && key !== 'referee')
                  .map(([key]) => (
                    <button
                      key={key}
                      onClick={() => gotoMenu(key)}
                      className={`${selectedOption === key ? 'selected' : ''}`}
                    >
                      {key === 'home' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                        </svg>
                      ) : (
                        key.charAt(0).toUpperCase() + key.slice(1)
                      )}
                    </button>
                  ))
                }
              </div>
              {isAdmin || isReferee ? (
                <>
                  <div className='HP-Buttons-Referee'>
                    <button onClick={() => {gotoMenu('referee')}} className={`HPB-Referee ${selectedOption == 'referee' ? 'selected' : ''}`}>
                      Referee
                    </button>
                  </div>
                  {isAdmin &&
                  <div className='HP-Buttons-Admin'>
                    <button onClick={() => {gotoMenu('admin')}} className={`HPB-Admin ${selectedOption == 'admin' ? 'selected' : ''}`}>
                      Admin
                    </button>
                  </div>
                  }
                </>
              ) : (<></>)}
            </div>
          </div>
        </header>
        <main className='HP-Body'>
          <div className='HP-Body-Content'>
            <Outlet />
          </div>
        </main>
        <footer className='HP-Footer'>
          <div className='HP-Footer-Content'>
            <div className='HP-Networks'>
              <Link to={'https://www.instagram.com/hugomoru5/'} target='_blank'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                </svg>
              </Link>
              <Link to={'https://x.com/hugomoru5'} target='_blank'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-twitter-x" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                </svg>
              </Link>
              <p>{'{ dev: hugomoru5 }'}</p>
            </div>
            <div className='HP-Footer-Logo'>
              <Logo />
              <p>®   2025</p> 
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default App
