import React, { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const Logout = () => {
  const authContext = useContext(AuthContext);

  const handleLogout = () => {
    // Call the logout function from the context
    authContext.logout();
  };

  return handleLogout;
};

export default Logout;
