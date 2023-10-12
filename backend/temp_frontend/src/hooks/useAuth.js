//This is a custom hook that we will use to get the context in any component that we want to use it in.

import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const useAuth = () => {
  const context = useContext(AuthContext);

  return context;
};

export default useAuth;

