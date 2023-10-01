import React from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Logout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  setAuth({});
  navigate("/login");
};

export default Logout;

{
  /*
Is uselocation needed here?

*/
}
