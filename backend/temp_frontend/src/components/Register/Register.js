import React from "react";
import { useState, useEffect } from "react";
import axios from "../../api/Axios";
import { Link } from "react-router-dom";
const REGISTER_URL = "/register";
const RECEIVE_MAIL_URL = "/receive_mail";

const Register = () => {
  const [first_name, setFirst] = useState("");
  const [last_name, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  const [re_password, setRePassword] = useState("");

  const [errMsg, setErrMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ email, first_name, last_name, password, re_password }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(response);
      // Step 2: Send a request to receive mail (assuming it sends the verification email)
      await axios.post(RECEIVE_MAIL_URL, {});
      
      //uid and token is obtained from the url pattern of the email verification link
      //http://localhost:8000/activate/uid/token
      

      console.log(emailVerificationResponse?.uid);
      console.log(emailVerificationResponse?.token);
      console.log(JSON.stringify(emailVerificationResponse));

      //clear state and controlled inputs

      setFirst("");
      setLast("");
      setEmail("");
      setPwd("");
      setRePassword("");
    } catch (err) {
      if (!err?.response) {
        //Show server not found page
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Registration Failed");
        console.log(errMsg);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-full justify-center items-center gap-4">
        <div className="flex justify-center items-center h-[10%] ">
          <h1 className="font-semibold md:font-bold text-4xl ">Register</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col w-full h-[50%] gap-8"
        >
          <input
            type="text"
            id="username"
            placeholder="Enter first name"
            autoComplete="off"
            onChange={(e) => setFirst(e.target.value)}
            value={first_name}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <input
            type="text"
            id="username"
            placeholder="Enter last name"
            autoComplete="off"
            onChange={(e) => setLast(e.target.value)}
            value={last_name}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <input
            type="email"
            id="email"
            placeholder="Enter email"
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

          <input
            type="repassword"
            id="repassword"
            placeholder="Reenter password"
            onChange={(e) => setRePassword(e.target.value)}
            value={re_password}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <button
            className="flex text-xl font-medium bg-black text-white py-2 px-8 rounded-3xl items-center justify-center hover:bg-[#27272a]"
            onClick={handleSubmit}
          >
            Register
          </button>
        </form>
        <p className="font-normal px-2 text-sm">
          Already registered?
          <Link to="/login" className="text-blue-600 text-base">
            {" "}
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
