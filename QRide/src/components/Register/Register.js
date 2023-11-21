import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthProvider";
import supabase from "../../config/supabaseClient";
import "./GoogleButtonStyle.css";


const Register = () => {
  const { session, signIn, signInWithGoogle } = useAuth();
  const navigate=useNavigate();
  const [userinput, setUserInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // New state for success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const loginsocial = async (provider) => {
    try {
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        console.error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Error logging in with ${provider}:`, error.message);
    }
  };


  const createUserDetails = async (userId, firstname, lastname) => {
    try {
      const { data, error } = await supabase.from("user_details").insert([
        {
          user_id: userId,
          first_name: firstname,
          last_name: lastname,
          // Other profile data as needed
        },
      ]);

      if (error) {
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error creating user profile:", error.message);
      return null;
    }
  };

  const createnewuser = async (email, password,first_name,last_name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: first_name,
            last_name: last_name,
          },
        },
      });

      if (error) {
        throw error;
      }
      if (data) {
        console.log("User registered:", data);

        {/*const {
          data: { user },
        } = await supabase.auth.getUser();
        // Update user profile with additional data
        await createUserDetails(
          user.id,
          userinput.first_name,
          userinput.last_name
        ); // Pass the user ID and name
        */}
        
        // Show success message and redirect after a short delay
        setSuccessMsg("User registered successfully!");
        setTimeout(() => {
          navigate("/login"); // Change from history.push to navigate
        }, 2000);
      }
      return data;
    } catch (error) {
      console.error("Error registering user:", error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createnewuser(userinput.email, userinput.password,userinput.first_name,userinput.last_name);
  };

  return (
    <>
      <div className="flex flex-col w-full h-full justify-center items-center gap-4">
        {/* Add the success message */}
        {successMsg && (
          <div className="bg-green-200 text-green-800 p-2 rounded-md">
            {successMsg}
          </div>
        )}
        {/* Remaining code unchanged */}
        <div className="flex justify-center items-center h-[10%]">
          <h1 className="font-semibold md:font-bold text-4xl">Register</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center flex-col w-full h-[50%] gap-8"
        >
          {/* Input fields */}
          <input
            type="text"
            id="firstname"
            name="first_name"
            placeholder="Enter first name"
            autoComplete="off"
            onChange={handleChange}
            value={userinput.first_name}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />
          <input
            type="text"
            id="lastname"
            name="last_name"
            placeholder="Enter last name"
            autoComplete="off"
            onChange={handleChange}
            value={userinput.last_name}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter email"
            autoComplete="off"
            onChange={handleChange}
            value={userinput.email}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            onChange={handleChange}
            value={userinput.password}
            required
            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
          />
          <button
            className="flex text-xl font-medium bg-black text-white py-2 px-8 rounded-3xl items-center justify-center hover:bg-[#27272a]"
            type="submit"
          >
            Register
          </button>
          <button className="google-button" onClick={() => loginsocial('google')}>
            Continue with Google
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
