import React, { useState } from "react";
import { Link } from "react-router-dom";
import supabase from "../../config/supabaseClient";

const Register = () => {
  const [userinput, setUserInput] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const createnewuser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }
      if (data) {
        console.log("User registered:", data);

        const {
          data: { user },
        } = await supabase.auth.getUser();
        // Update user profile with additional data
        await createUserDetails(
          user.id,
          userinput.first_name,
          userinput.last_name
        ); // Pass the user ID and name
      }
      return data;
    } catch (error) {
      console.error("Error registering user:", error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    createnewuser(userinput.email, userinput.password);
  };

  return (
    <>
      <div className="flex flex-col w-full h-full justify-center items-center gap-4">
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
