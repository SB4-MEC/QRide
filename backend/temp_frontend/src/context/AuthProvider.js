import React, { useState, useEffect, createContext } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["authTokens"]);
  const storedTokens = cookies.authTokens || {};
  const [authTokens, setAuthTokens] = useState(storedTokens);

  const loggedIn = !!authTokens.access_token;

  useEffect(() => {
    if (loggedIn && !authTokens.access_token) {
      // Handle logout when the access token expires
      setAuthTokens({});
    }
  }, [authTokens.access_token]);

  const handleLogout = () => {
    removeCookie('authTokens');
    setAuthTokens({});
};

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
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

