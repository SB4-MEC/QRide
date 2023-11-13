import React, { useContext,useState } from 'react';
import './layout1.css';
import home_image from '../Assets/home.png';
import heart_image from '../Assets/favourite.png';
import scan_image from '../Assets/qrcode.png';
// import logout_image from '../Assets/logout.png';
import user_image from '../Assets/profile.png';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider'; // Provide the correct path to your AuthProvider.js file
import bg_image from '../Assets/bg.png';

const Layout1 = ({children}) => {
    const navigate = useNavigate();
    const { handleLogout } = useContext(AuthContext);

    const navigateToHome = () => {
        navigate('/');
    };

    const navigateToQr = () => {
        navigate('/QR');
    };

    const navigateToFav = () => {
        navigate('/Fav');
    };

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const openUserModal = () => {
      setIsUserModalOpen(true);
    };
  
    const closeUserModal = () => {
      setIsUserModalOpen(false);
    };
  
    return (
        <div className="bg-[#c9e9e1]">
             {/* <div className='qride'>
                QRide
            </div> */}
            <div className="bg-image">
                <img src={bg_image} alt="Background" />
            </div>
            <div className="row">    
                <div className="container">
                    <div className="user-info" onMouseEnter={openUserModal} onMouseLeave={closeUserModal}>
                         <img src={user_image} alt="User" className="user-icon" />
                    </div>
                    <div className="icons">
                        <img src={home_image} onClick={navigateToHome} className="icon" alt="Home" />
                        <img src={scan_image} onClick={navigateToQr} className="icon" alt="QR Code" />
                        <img src={heart_image} onClick={navigateToFav} className="icon" alt="Favorite" />
                        {/* <img src={logout_image} onClick={handleLogout} className="icon" alt="Logout" /> */}
                    </div>
                </div>
                {isUserModalOpen && (
                <div className="user-modal" onMouseEnter={openUserModal} onMouseLeave={closeUserModal}>
                    <p>Dias George </p>
                    <p>diasgt123@gmail.com </p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
                )}
                {children}
            </div>     
        </div>
    );
};

export default Layout1;
