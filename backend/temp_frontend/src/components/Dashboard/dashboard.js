import React, { useContext } from 'react';
import './dashboard.css';
import home_image from '../Assets/home.png';
import heart_image from '../Assets/favourite.png';
import scan_image from '../Assets/qrcode.png';
import logout_image from '../Assets/logout.png';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthProvider'; // Provide the correct path to your AuthProvider.js file

const Dashboard = () => {
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

    return (
        <div className="bg-[#c9e9e1]">
            <div className="row">    
                <div className="container">
                    <div className="icons">
                        <img src={home_image} onClick={navigateToHome} className="icon" alt="Home" />
                        <img src={scan_image} onClick={navigateToQr} className="icon" alt="QR Code" />
                        <img src={heart_image} onClick={navigateToFav} className="icon" alt="Favorite" />
                        <img src={logout_image} onClick={handleLogout} className="icon" alt="Logout" />
                    </div>
                </div>
                <div className="search-box">
                    <input type="text" placeholder="Search" className="search" />
                    <a href="#">
                        <i className="fas fa-search" style={{ color: 'black' }}></i>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
