import React, { useState, useEffect, createContext, useContext } from "react";
import supabase from "../config/supabaseClient";

export const AuthContext = createContext({});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [auth, setAuth] = useState(false);



  useEffect(() => {
    const { data, error } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (error) {
          console.log(error);
        }
        if (event === "SIGNED_IN") {
          setUser(session.user);
          setAuth(true);
        }
        if (event === "SIGNED_OUT") {
          setUser(null);
          setAuth(false);
        }
      }
    );
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
