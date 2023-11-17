import React, { useState, useEffect, createContext } from "react";
import supabase from "../config/supabaseClient";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState()
    const [session, setSession] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const setData = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            setSession(session)
            setUser(session?.user)
            setLoading(false);
        };

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user)
            setLoading(false)
        });

        setData();

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const value = {
        session,
        user,
        signUp: (data) => supabase.auth.signUp(data),
    signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
    };

  
  return (
    <AuthContext.Provider
      value={value}
    >{!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

