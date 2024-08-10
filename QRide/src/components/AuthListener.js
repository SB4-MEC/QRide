import { useEffect } from 'react';
import supabase from "../config/supabaseClient";

const AuthListener = ({ onLogin, onLogout }) => {
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        try {
          await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/logged_in`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': process.env.REACT_APP_ANON_KEY,
            },
            body: JSON.stringify({ user_id: session.user.id }),
          });
          console.log("User logged in");
          onLogin(session);
        } catch (error) {
          console.error('Error logging user in:', error);
        }
      }

      if (event === "SIGNED_OUT") {
        const userId = session?.user?.id;
        console.log("User ID:", userId);

        if (userId) {
          try {
            const response = await fetch(`${process.env.REACT_APP_SUPABASE_URL}/rest/v1/logged_in?user_id=eq.${userId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'apikey': process.env.REACT_APP_ANON_KEY,
              },
            });
            console.log("Delete response:", response);
            console.log("User logged out");
          } catch (error) {
            console.error('Error logging user out:', error);
          }
        }
        onLogout();
      }
    });

    return () => {
      if (authListener && typeof authListener.subscription.unsubscribe === 'function') {
        authListener.subscription.unsubscribe();
      }
    };
  }, [onLogin, onLogout]);

  return null;
};

export default AuthListener;
