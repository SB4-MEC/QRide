import React, { useContext,useState } from 'react';
import './dashboard.css';
import home_image from '../Assets/home.png';
import heart_image from '../Assets/favourite.png';
import scan_image from '../Assets/qrcode.png';
// import logout_image from '../Assets/logout.png';
import user_image from '../Assets/profile.png';
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

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const openUserModal = () => {
      setIsUserModalOpen(true);
    };
  
    const closeUserModal = () => {
      setIsUserModalOpen(false);
    };
  
    return (
        <div className="bg-[#c9e9e1]">
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
                <div className="column">
                    <div className='heading'>
                        {/* <h1>Available Routes</h1> */}
                    </div>
                    <div class="ag-format-container">
                        <div class="ag-courses_box">
                            <div class="ag-courses_item">
                                <a href="#" class="ag-courses-item_link">
                                    <div class="ag-courses-item_bg"></div>
                                    <div class="ag-courses-item_title">
                                    Aluva - Vytilla
                                    </div>
                                </a>
                            </div>

                            <div class="ag-courses_item">
                                <a href="#" class="ag-courses-item_link">
                                    <div class="ag-courses-item_bg"></div>
                                    <div class="ag-courses-item_title">
                                    Thrippunithura - Thoppumpady
                                    </div>
                                </a>
                            </div>

                            <div class="ag-courses_item">
                                <a href="#" class="ag-courses-item_link">
                                    <div class="ag-courses-item_bg"></div>

                                    <div class="ag-courses-item_title">
                                    Angamaly - Vytilla
                                    </div>
                                </a>
                            </div>

                            <div class="ag-courses_item">
                                <a href="#" class="ag-courses-item_link">
                                    <div class="ag-courses-item_bg"></div>
                                    <div class="ag-courses-item_title">
                                    Fort Kochi - Pookkattupady
                                    </div>
                                </a>
                            </div>

                            <div class="ag-courses_item">
                                <a href="#" class="ag-courses-item_link">
                                    <div class="ag-courses-item_bg"></div>
                                    <div class="ag-courses-item_title">
                                    Aluva - Infopark
                                    </div>
                                </a>
                            </div>

                            <div class="ag-courses_item">
                                <a href="#" class="ag-courses-item_link">
                                    <div class="ag-courses-item_bg"></div>
                                    <div class="ag-courses-item_title">
                                    Willington island - Infopark
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
