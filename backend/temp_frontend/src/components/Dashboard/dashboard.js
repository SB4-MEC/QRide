import React from 'react';
import './dashboard.css';
import home_image from '../Assets/home.png';
import heart_image from '../Assets/favourite.png';
import scan_image from '../Assets/qrcode.png';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
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
