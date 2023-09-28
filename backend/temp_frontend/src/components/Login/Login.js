import React from "react";
import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/Axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ email, pwd, roles, accessToken });
      setEmail("");
      setPwd("");
      navigate(from, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      
      <div className="flex flex-col w-full h-full justify-center items-center py-4 gap-2">
        {/*<p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
  </p>*/}
        <div className="flex justify-center items-center h-[10%] ">
          <h1 className="font-semibold md:font-bold text-4xl ">Login</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col w-full h-[50%] gap-8"
        >
          <input
            type="text"
            id="email"
            placeholder="Enter email"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <input
            type="password"
            id="password"
            placeholder="Enter password"
            onChange={(e) => setPwd(e.target.value)}
            value={pwd}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <button className="flex text-xl font-medium bg-black text-white py-2 px-8 rounded-3xl items-center justify-center hover:bg-[#27272a]">
            Sign In
          </button>
        </form>
        <p className="font-normal px-2 text-sm">
          Need an Account? 
         
            <Link to="/register" className="text-blue-600 text-base "> Register</Link>
          
        </p>
      </div>
    </>
  );
};

export default Login;
