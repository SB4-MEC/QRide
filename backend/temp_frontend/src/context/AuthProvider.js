import { createContext, useState } from "react";

export const AuthContext = createContext({});

export default AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  
  {
    /*
      The following logout is not possible because we can't use functions as values in context

      const logout = () => {
        setAuth({});
      }

    */
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

{
  /*

  What is context meant for?
    Context is meant for sharing data that can be considered “global” for a tree of React components, such as the current authenticated user, theme, or preferred language.
  
  Whatever we create using createContext is a context object

  What happens if we dont use context in the above example?
    We will have to pass props down manually at every level


  What is the difference between context and props?
    Props are used to pass data down the component tree. Context is used to pass data across the component tree without having to pass props down manually at every level.

  What is the difference between context and redux?
    Redux is a state management library. Context is a feature of React that allows sharing data across the component tree without having to pass props down manually at every level.

  
  What is this snippet doing?
   Why are we exporting AuthContext?
   Because we want to use the context in multiple components
   The initial value of the context is an empty object. So if we try to use the context in any component without using the provider, we will get an empty object.
    We are exporting the AuthProvider so that we can use it in index.js
    So authcontext will be accessible in any component that is wrapped inside the AuthProvider
    Authcontext takes values from the AuthProvider
    In this case, the value is an object with two properties: auth and setAuth

    Note that authcontext is a nested object here where auth and setAuth are the properties of the object and auth in turn has four properties: email, pwd, roles, accessToken
    Example for authcontext object syntax:
    const authcontext = {
      auth: {
        email: ""
        pwd: ""
        accessToken: ""
      }
    }

    Logout is a function that sets the auth object to an empty object
    Can we provide logout as a value to the AuthContext?
    No, because logout is a function and we can't use functions as values in context
    Then how do we use logout in any component?
    How to logout a user and setauth to an empty object?
    We will use the logout function in the logout button in the navbar
    
   
   
*/
}
