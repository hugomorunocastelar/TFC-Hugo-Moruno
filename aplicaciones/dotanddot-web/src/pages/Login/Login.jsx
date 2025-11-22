import React, { useState } from 'react';
import "./Login.css";
import LoginForm from "./partials/login/LoginForm.jsx";
import RegisterForm from "./partials/register/RegisterForm.jsx";

function Login() {

  const [selectedOption, setOption] = useState(0);

  return (
    <div className='LoginPanel'>
      <div className='LP-Title'>
        <p>Dot&Dot: Voley Administration</p>
      </div>
      <div className='LP-Identification'>
        <div className='LP-Buttons'>
          <button onClick={() => {setOption(0)}} className={`${selectedOption == 0 ? 'selected' : ''}`}>Login</button>
          <button onClick={() => {setOption(1)}} className={`${selectedOption == 1 ? 'selected' : ''}`}>Register</button>
        </div>
        <div className='LP-Element'>
          { selectedOption == 0 ? 
            (
              <LoginForm />
            ) : (
              <RegisterForm />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Login