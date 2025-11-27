let IP = import.meta.env.VITE_API_URL;

const BACK_IP = IP;
const ADMIN_BACK_IP = `${BACK_IP}/admin`;
const OPEN_BACK_IP = `${BACK_IP}/open`;

const API = {
  AUTH: {
    ROOT: `${BACK_IP}/auth`,
    LOGIN: `${BACK_IP}/auth/login`,
    REGISTER: `${BACK_IP}/auth/register`,
    VERIFY: (TOKEN) => `${BACK_IP}/auth/verify?token=${TOKEN}`,
    FORGOTPASSWORD: (EMAIL) => `${BACK_IP}/auth/forgot-password?email=${EMAIL}`,
    RESETPASSWORD: `${BACK_IP}/auth/reset-password`,
    VALIDATE:`${BACK_IP}/validate/user`,
    ROLE: (ROLE) => `${BACK_IP}/validate/rol/${ROLE}`,
  },
  CONTACT: {
    SEND: `${BACK_IP}/contact/public`
  },
  PERSON: {
    ROOT: `${ADMIN_BACK_IP}/person`,
    ALL: `${ADMIN_BACK_IP}/person`,
    CREATE: `${ADMIN_BACK_IP}/person`,
    READ: (id) => `${ADMIN_BACK_IP}/person/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/person/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/person/${id}`,
  },
  CLUBS: {
    ROOT: `${ADMIN_BACK_IP}/clubs`,
    ALL: `${ADMIN_BACK_IP}/clubs`,
    CREATE: `${ADMIN_BACK_IP}/clubs`,
    READ: (id) => `${ADMIN_BACK_IP}/clubs/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/clubs/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/clubs/${id}`,
  },
  CITIES: {
    ROOT: `${ADMIN_BACK_IP}/cities`,
    ALL: `${ADMIN_BACK_IP}/cities`,
    CREATE: `${ADMIN_BACK_IP}/cities`,
    READ: (id) => `${ADMIN_BACK_IP}/cities/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/cities/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/cities/${id}`,
  },
  TEAM: {
    ROOT: `${ADMIN_BACK_IP}/teams`,
    ALL: `${ADMIN_BACK_IP}/teams`,
    CREATE: `${ADMIN_BACK_IP}/teams`,
    READ: (id) => `${ADMIN_BACK_IP}/teams/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/teams/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/teams/${id}`,
  },
  COACH: {
    ROOT: `${ADMIN_BACK_IP}/coaches`,
    ALL: `${ADMIN_BACK_IP}/coaches`,
    CREATE: `${ADMIN_BACK_IP}/coaches`,
    READ: (id) => `${ADMIN_BACK_IP}/coaches/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/coaches/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/coaches/${id}`,
  },
  GAMEPLACE: {
    ROOT: `${ADMIN_BACK_IP}/gameplaces`,
    ALL: `${ADMIN_BACK_IP}/gameplaces`,
    CREATE: `${ADMIN_BACK_IP}/gameplaces`,
    READ: (id) => `${ADMIN_BACK_IP}/gameplaces/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/gameplaces/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/gameplaces/${id}`,
  },
  LEAGUE: {
    ROOT: `${ADMIN_BACK_IP}/leagues`,
    ALL: `${ADMIN_BACK_IP}/leagues`,
    CREATE: `${ADMIN_BACK_IP}/leagues`,
    READ: (id) => `${ADMIN_BACK_IP}/leagues/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/leagues/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/leagues/${id}`,
  },
  PLAYER: {
    ROOT: `${ADMIN_BACK_IP}/players`,
    ALL: `${ADMIN_BACK_IP}/players`,
    CREATE: `${ADMIN_BACK_IP}/players`,
    READ: (id) => `${ADMIN_BACK_IP}/players/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/players/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/players/${id}`,
  },
  REFEREE: {
    ROOT: `${ADMIN_BACK_IP}/referees`,
    ALL: `${ADMIN_BACK_IP}/referees`,
    CREATE: `${ADMIN_BACK_IP}/referees`,
    READ: (id) => `${ADMIN_BACK_IP}/referees/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/referees/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/referees/${id}`,
    GAMES: (refereeId) => `${BACK_IP}/referee/games/${refereeId}`,
  },
  SEASONS: {
    ROOT: `${ADMIN_BACK_IP}/seasons`,
    ALL: `${ADMIN_BACK_IP}/seasons`,
    CREATE: `${ADMIN_BACK_IP}/seasons`,
    READ: (id) => `${ADMIN_BACK_IP}/seasons/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/seasons/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/seasons/${id}`,
  },
  COMPETITION: {
    ROOT: `${ADMIN_BACK_IP}/competitions`,
    ALL: `${ADMIN_BACK_IP}/competitions`,
    CREATE: `${ADMIN_BACK_IP}/competitions`,
    READ: (id) => `${ADMIN_BACK_IP}/competitions/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/competitions/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/competitions/${id}`,
  },
  USERS: {
    ROOT: `${ADMIN_BACK_IP}/users`,
    ALL: `${ADMIN_BACK_IP}/users`,
    CREATE: `${ADMIN_BACK_IP}/users`,
    READ: (id) => `${ADMIN_BACK_IP}/users/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/users/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/users/${id}`,
    UPDATESELF: `${OPEN_BACK_IP}/users/self`,
  },
  ROLES: {
    ROOT: `${ADMIN_BACK_IP}/roles`,
    ALL: `${ADMIN_BACK_IP}/roles`,
    CREATE: `${ADMIN_BACK_IP}/roles`,
    READ: (id) => `${ADMIN_BACK_IP}/roles/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/roles/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/roles/${id}`,
  },
  GAMES: {
    ROOT: `${ADMIN_BACK_IP}/games`,
    ALL: `${ADMIN_BACK_IP}/games`,
    CREATE: `${ADMIN_BACK_IP}/games`,
    READ: (id) => `${ADMIN_BACK_IP}/games/${id}`,
    UPDATE: (id) => `${ADMIN_BACK_IP}/games/${id}`,
    DELETE: (id) => `${ADMIN_BACK_IP}/games/${id}`,
  },
  OPEN: {
    CLUBS: {
      ROOT: `${OPEN_BACK_IP}/clubs`,
      ALL: `${OPEN_BACK_IP}/clubs`
    },
    CITIES: {
      ROOT: `${OPEN_BACK_IP}/cities`,
      ALL: `${OPEN_BACK_IP}/cities`
    },
    GAMES: {
      ROOT: `${OPEN_BACK_IP}/games`,
      ALL: `${OPEN_BACK_IP}/games`,
      OM: `${OPEN_BACK_IP}/games/outstanding-match`
    },
    CONTACT: `${BACK_IP}/contact/public`
  }
  ,
  IMAGE: {
    SAVE: `${BACK_IP}/image/save`,
    GET: (filename) => `${BACK_IP}/image/get/${filename}`
  }
};

export default API;