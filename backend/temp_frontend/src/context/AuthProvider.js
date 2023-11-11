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
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (loggedIn && !authTokens.access_token) {
      // Handle logout when the access token expires
      setAuthTokens({});
      setLoggedIn(false);
      setUser(null);
    }
  }, [authTokens.access_token]);

  const handleLogout = () => {
    removeCookie('authTokens');
    setAuthTokens({});
    setLoggedIn(false);
    setUser(null);
    console.log("Logged out");
    navigate('/login');
};

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        user,
        setUser,
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

