import React from "react";
import { useRef, useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "../../api/Axios";
import { Link, useNavigate, useLocation } from "react-router-dom";
const LOGIN_URL = "/auth/jwt/create/";

const Login = () => {
  {/*object destructuring
    https://www.youtube.com/watch?v=NIq3qLaHCIs  */}
  const { setAuth,setLogged,setCookie } = useAuth();

  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
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
        JSON.stringify({ email, password }), //Diff between javascript objects and json strings
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log(data)
        setCookie("auth_token", data.access)
      {/*
        headers are used to tell the server that we are sending json data
        withCredentials is used to send cookies along with the request, that is, credentials are sent along with the request
      */}
      console.log(JSON.stringify(response?.data));
      //console.log(JSON.stringify(response));

      //Dont forget to parse the json response to javascript object

      const accessToken = response?.data?.access;
      const refreshToken = response?.data?.refresh;
      setAuth({ email, pwd, accessToken, refreshToken });
      setLogged(true);
      {/*How does this auth object look now?
        auth: {
          email: "blabla@gmail.com"
          pwd: "1234"
          roles: ['100']
          accessToken: "34gjd356ydfi"
        }
        
    */}
      
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
            value={password}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <button className="flex text-xl font-medium bg-black text-white py-2 px-8 rounded-3xl items-center justify-center hover:bg-[#27272a]">
            Login
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
