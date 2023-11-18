import React, { useContext, useState, useEffect } from "react";
import "./layout1.css";
import home_image from "../Assets/home.png";
import heart_image from "../Assets/favourite.png";
import scan_image from "../Assets/qrcode.png";
import user_image from "../Assets/profile.png";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthProvider";
import bg_image from "../Assets/bg.png";
import supabase from "../../config/supabaseClient";

// ... (other imports)

const Layout1 = ({ children }) => {
  const navigate = useNavigate();
  //const { handleLogout } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  useEffect(() => {
  const fetchuser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }
      if (user) {
        console.log(user);
        setUserData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
        });
      }
    } catch (error) {
      console.error("Error fetching email:", error.message);
    }
  };
  fetchuser();

}, []);
  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToQr = () => {
    navigate("/QR");
  };

  const navigateToFav = () => {
    navigate("/Fav");
  };

  const openUserModal = () => {
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  return (
    <div className="bg-[#c9e9e1]">
      <div className="bg-image">
        <img src={bg_image} alt="Background" />
      </div>
      <div className="row">
        <div className="container">
          <div
            className="user-info"
            onMouseEnter={openUserModal}
            onMouseLeave={closeUserModal}
          >
            <img src={user_image} alt="User" className="user-icon" />
          </div>
          <div className="icons">
            <img
              src={home_image}
              onClick={navigateToHome}
              className="icon"
              alt="Home"
            />
            <img
              src={scan_image}
              onClick={navigateToQr}
              className="icon"
              alt="QR Code"
            />
            <img
              src={heart_image}
              onClick={navigateToFav}
              className="icon"
              alt="Favorite"
            />
          </div>
        </div>
        {isUserModalOpen && (
          <div
            className="user-modal"
            onMouseEnter={openUserModal}
            onMouseLeave={closeUserModal}
          >
            <p>
              {userData.first_name} {userData.last_name}
            </p>
            <p>{userData.email}</p>
            <button onClick={() => supabase.auth.signOut()}>Logout</button>        
            </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout1;
