import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { validateRole, validateSession } from "./js/auth.mjs";
import { getSession } from "./js/session.mjs";
import Loader from "./pages/Loader/Loader";

const AuthRefereeGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const session = getSession();

    if (session) {
      validateSession().then((result) => {
        if (result) {
          validateRole("admin").then((response) => {
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
    return <Loader />;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRefereeGuard;
