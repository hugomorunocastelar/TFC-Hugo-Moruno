let IP = import.meta.env.VITE_API_URL;
const BACK_IP = IP;

const API = {
  AUTH: {
    ROOT: `${BACK_IP}/auth`,
    LOGIN: `${BACK_IP}/auth/login`,
    REGISTER: `${BACK_IP}/auth/register`,
    VALIDATE: {
      ROOT: `${BACK_IP}/auth/validate`,
      ADMIN: `${BACK_IP}/auth/test/admin`
    }
  },
  PERSON: {
    ROOT: `${BACK_IP}/person`,
    FIND: (personId) => `${BACK_IP}/person/${personId}`,
  }
};

export default API;