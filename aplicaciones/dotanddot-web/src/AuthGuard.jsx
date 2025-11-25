import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateSession } from "./js/auth.mjs";
import { getSession } from "./js/session.mjs";
import Loader from "./pages/Loader/Loader";

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
    return <Loader />;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthGuard;
