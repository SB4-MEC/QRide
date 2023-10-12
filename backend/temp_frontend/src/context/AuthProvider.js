import React, { useState, useEffect, createContext} from 'react';
import { useCookies } from 'react-cookie';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(['authTokens']);
  const storedTokens = cookies.authTokens || {};
  const [authTokens, setAuthTokens] = useState(storedTokens);

  const loggedIn = !!authTokens.access_token;

  useEffect(() => {
    if (loggedIn && !authTokens.access_token) {
      // Handle logout when the access token expires
      setAuthTokens({});
    }
  }, [authTokens.access_token]);

  const login = (uid, access_token, refresh_token) => {
    const tokens = { uid, access_token, refresh_token };
    setCookie('authTokens', JSON.stringify(tokens));
    setAuthTokens(tokens);
  };

  const logout = () => {
    removeCookie('authTokens');
    setAuthTokens({});
  };

  return (
    <AuthContext.Provider value={{ loggedIn, auth: authTokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;



