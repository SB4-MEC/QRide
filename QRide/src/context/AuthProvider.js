import React, { useState, createContext, useContext, useEffect } from 'react';
import supabase from "../config/supabaseClient";
import AuthListener from '../components/AuthListener';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const userSession = data?.session;
        const user = userSession?.user;

        setSession(userSession);
        setUser(user);
        setLoggedIn(!!user);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = (authSession) => {
    setSession(authSession);
    setUser(authSession?.user);
    setLoggedIn(!!authSession?.user);
  };

  const handleLogout = () => {
    setSession(null);
    setUser(null);
    setLoggedIn(false);
  };

  const value = {
    session,
    user,
    loggedIn,
    signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data).then(({ user }) => setLoggedIn(!!user)),
    signInWithGoogle: () => supabase.auth.signInWithOAuth({ provider: "google" }).then(({ user }) => setLoggedIn(!!user)),
    signOut: () => supabase.auth.signOut().then(() => setLoggedIn(false)),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && (
        <>
          <AuthListener onLogin={handleLogin} onLogout={handleLogout} />
          {children}
        </>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
