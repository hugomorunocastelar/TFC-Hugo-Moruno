import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateReferee, validateSession } from "./js/AUTH.mjs";
import { getSession } from "./js/session.mjs";

const AuthRefereeGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const session = getSession();

    if (session) {
      validateSession().then((result) => {
        if (result) {
          validateReferee().then((response) => {
            setIsAuthenticated(response);
          })
        } else {
          setIsAuthenticated(result)
        }
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <p>Validating referee session...</p>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRefereeGuard;
