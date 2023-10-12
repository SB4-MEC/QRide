import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Logout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  removeCookie("auth_token")
  setAuth({});
  setLogged(false);
  navigate("/login");
};

export default Logout;

{
  /*
Is uselocation needed here?

*/
}
