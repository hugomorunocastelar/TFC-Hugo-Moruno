import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateSession } from "./js/AUTH.mjs";
import { getSession } from "./js/session.mjs";

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const session = getSession();

    if (session) {
      validateSession().then((result) => {
        setIsAuthenticated(result);
      });
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthGuard;
