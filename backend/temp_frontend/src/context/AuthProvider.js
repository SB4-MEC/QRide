import React, { useState, useEffect, createContext } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["authTokens"]);
  const storedTokens = cookies.authTokens || {};
  const [authTokens, setAuthTokens] = useState(storedTokens);
  const navigate=useNavigate();

  const [loggedIn,setLoggedIn]=useState(false);

  useEffect(() => {
    if (loggedIn && !authTokens.access_token) {
      // Handle logout when the access token expires
      setAuthTokens({});
      setLoggedIn(false);
    }
  }, [authTokens.access_token]);

  const handleLogout = () => {
    removeCookie('authTokens');
    setAuthTokens({});
    setLoggedIn(false);
    navigate('/login');
};

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        setAuthTokens,
        setCookie,
        removeCookie,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

