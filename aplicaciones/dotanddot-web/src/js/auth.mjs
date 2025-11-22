import API from "./env.js";
import * as http from "./http.js";
import * as session from "./session.mjs";

export async function login(username, password) {
  try
  {
    const response = await fetch(API.AUTH.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });
    if (!response.ok)
    {
      throw new Error('Login failed');
    }
    const data = await response.json();
    session.saveSession(data);
    return true;
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
    const response = await http.get(API.AUTH.VALIDATE.USER);
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

export async function validateAdmin() {
  try
  {
    const response = await http.get(API.AUTH.VALIDATE.ADMIN);
    if (!response.ok)
    {
      return false;
    }
    return response.json();
  } catch (error)
  {
    session.removeSession();
    return false;
  }
}

export async function validateReferee() {
  try
  {
    const response = await http.get(API.AUTH.VALIDATE.REFEREE);
    if (!response.ok)
    {
      return false;
    }
    return response.json();
  } catch (error)
  {
    session.removeSession();
    return false;
  }
}


