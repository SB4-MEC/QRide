import React from "react";
import { useState} from "react";
import axios from "../../api/Axios";
import { Link } from "react-router-dom";
const REGISTER_URL = "/auth/users/";


const Register = () => {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    re_password: "",
  })
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const create_user_response = await axios.post(
        REGISTER_URL,
        JSON.stringify(user),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
  
      // Check if the registration was successful
      if (create_user_response.status === 200) {
        console.log("Registration successful. Email will be sent in the background.");
      } else {
        // Registration failed
        setErrMsg("Registration Failed");
        console.log(errMsg);
      }
    } catch (err) {
      // Handle errors here
      if (!err?.create_user_response) {
        // Show server not found page
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
            onChange={handleChange}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <input
            type="text"
            id="username"
            placeholder="Enter last name"
            autoComplete="off"
            onChange={handleChange}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <input
            type="email"
            id="email"
            placeholder="Enter email"
            onChange={handleChange}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <input
            type="password"
            id="password"
            placeholder="Enter password"
            onChange={handleChange}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <input
            type="repassword"
            id="repassword"
            placeholder="Reenter password"
            onChange={handleChange}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />

          <button
            className="flex text-xl font-medium bg-black text-white py-2 px-8 rounded-3xl items-center justify-center hover:bg-[#27272a]"
            type="submit"
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

