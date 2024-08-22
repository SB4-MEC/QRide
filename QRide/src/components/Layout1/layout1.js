import React, { useState, useEffect } from "react";
import "./layout1.css"; 
import home_image from "../Assets/home.png";
import heart_image from "../Assets/favourite.png";
import scan_image from "../Assets/qrcode.png";
import user_image from "../Assets/profile.png";
import bell_image from "../Assets/bell.jpg"; // Import the bell icon image
import { useNavigate } from "react-router-dom";
import bg_image from "../Assets/bg.png";
import supabase from "../../config/supabaseClient";
import BusNotifications from '../NotificationBar/Notifications'; // Ensure this path is correct

const Layout1 = ({ children }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    credits:""
  });
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNavbarHovered, setIsNavbarHovered] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) throw error;

        if (user) {
          console.log("this  userdata");
          console.log(user);
          setUserData({
            email: user.email,
            name: user.user_metadata.name,
          });

          const userId = user.id;
          const { data: namedata, error: nameerror } = await supabase
            .from("user_details")
            .select("first_name, last_name, credits")
            .eq("user_id", userId);

          if (nameerror) throw nameerror;

          if (namedata && namedata.length > 0) {
            console.log(namedata);
            setUserData(prevData => ({
              ...prevData,
              first_name: namedata[0].first_name,
              last_name: namedata[0].last_name,
              credits: namedata[0].credits,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching email:", error.message);
      }
    };
    console.log("this is credits");
    console.log(userData.credits);
    fetchUser();
  }, []);

  const navigateToHome = () => {
    navigate("/dashboard");
  };

  const navigateToQr = () => {
    navigate("/qr"); // Ensure this is lowercase
  };

  const navigateToFav = () => {
    navigate("/fav");
  };

  const navigateToNotifications = () => {
    navigate("/notificationlist"); // Navigate to /notifications
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect or update state after successful logout
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <div className="bg-[#c9e9e1]">
      <BusNotifications /> 
      <div className="bg-image">
        <img src={bg_image} alt="Background" />
      </div>
      <div className="row">
        <div className="user-info" onMouseEnter={() => setIsUserModalOpen(true)} onMouseLeave={() => setIsUserModalOpen(false)}>
          <img src={user_image} alt="User" className="user-icon" />
          <div className={`user-modal ${isUserModalOpen ? 'visible' : ''}`}>
            <p>{userData.first_name} {userData.last_name} </p>
            {/* {userData.name} */}
            <p>{userData.email}</p>
            <p>Credits:{userData.credits}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
        <div
          className={`container ${isNavbarHovered ? 'expanded' : ''}`}
          onMouseEnter={() => setIsNavbarHovered(true)}
          onMouseLeave={() => setIsNavbarHovered(false)}
        >
          <div className="icons">
            <div className="icon-wrapper" onClick={navigateToHome}>
            <img src={home_image} className="icon" alt="Home" />
              <span className="icon-label">Home</span>
            </div>
            <div className="icon-wrapper" onClick={navigateToQr}>
              <img src={scan_image} className="icon" alt="QR Code" />
              <span className="icon-label">QR Code</span>
            </div>
            <div className="icon-wrapper" onClick={navigateToFav}>
              <img src={heart_image} className="icon" alt="Favorite" />
              <span className="icon-label">Favourite</span>
            </div>
            <div className="icon-wrapper" onClick={navigateToNotifications}>
              <img src={bell_image} className="icon" alt="Notifications" />
              <span className="icon-label">Notifications</span>
            </div>
          </div>
        </div>
        <div className="right-container" style={{ margin: 'auto', marginTop: '8rem', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout1;
