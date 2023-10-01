//This is a custom hook that we will use to get the context in any component that we want to use it in.

import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export default useAuth;

{
  /* The reason for making this hook - ->
    We want to use the context in multiple components
    but we don't want to import the context in every component
    so we make a hook to use the context in any component
    that we want to use it in.
    Wht happens if we dont use the hook?  
    The syntax will look like this in Login.js:
    import { AuthContext } from "../../context/AuthProvider"; 
    import { useContext } from "react";
    And for auth,setauth destructuring we will have to do this:
    const {auth,setAuth} = useContext(AuthContext);

*/
}
