import API from "./env.js";
import * as http from "./http.js";
import * as session from "./session.mjs";

export async function login(username, password) {
  try
  {
    const response = await http.postPublic(API.AUTH.LOGIN, {
      username: username,
      password: password
    });
    if (!response.ok)
    {
      throw new Error('Login failed');
    }
    const data = await response.json();
    if (data.status == 200) {
      session.saveSession(data.message);
    }
    return data;
  } catch (error)
  {
    console.error('Login error:', error);
    return false;
  }
}

export async function register(body) {
  try
  {
    const response = await fetch(API.AUTH.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: body.username,
        email: body.email,
        password: body.password,
        passwordRepeat: body.passwordRepeat,
        lopd: body.lopd
      })
    });
    if (!response.ok)
    {
      throw new Error('Register failed');
    }
    const data = await response.json();
    session.saveSession(data);
    return true;
  } catch (error)
  {
    console.error('Register error:', error);
    return false;
  }
}

export async function validateSession() {
  try
  {
    const response = await http.get(API.AUTH.VALIDATE);
    if (!response.ok)
    {
      throw new Error('Session invalid');
    }
    return response.json();
  } catch (error)
  {
    session.removeSession();
    return false;
  }
}

export async function validateRole(role) {
  try
  {
    const response = await http.get(API.AUTH.ROLE(role));
    if (!response.ok)
    {
      return false;
    }
    return response.json();
  } catch (error)
  {
    console.error('Invalid role:', error);
    return false;
  }
}


export async function verifyAccount(token) {
  try
  {
    const response = await fetch(API.AUTH.VERIFY(token), {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }); 
    if (!response.ok)
    {
      throw new Error('Account verification failed');
    } 
    return response.json();
  } catch (error)
  {
    console.error('Account verification error:', error);
    return false;
  }
}

export async function forgotPassword(email) {
  try
  {
    const response = await http.getPublic(API.AUTH.FORGOTPASSWORD(email));
    if (!response.ok)
    {
      throw new Error('Forgot password request failed');
    }
    return response.json();
  } catch (error)
  {
    console.error('Forgot password error:', error);
    return false;
  }
}

export async function resetPassword(token, password, passwordRepeat) {
  try
  {
    const response = await http.postPublic(API.AUTH.RESETPASSWORD, {
      token: token,
      newPassword: password,
      confirmPassword: passwordRepeat
    });
    if (!response.ok)
    {
      throw new Error('Reset password request failed');
    }
    return response.json();
  } catch (error)
  {
    console.error('Reset password error:', error);
    return false;
  }
}