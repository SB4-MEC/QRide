import React from "react";
import Layout1 from "../Layout1/layout1";
import { useNavigate } from "react-router";
import "./dashboard.css"; // Ensure this is correctly linked

const Dashboard = () => {
  const navigate = useNavigate();
  
  const navigateToQr = () => {
    navigate("/qr");
  };

  const navigateToMap = () => {
    navigate("/map");
  };

  const navigateToHistory = () => {
    navigate("/history");
  };
  
  return (
    <Layout1>
      <div className="dashboard-container">
        <div className="large-grid" onClick={navigateToQr}>
          <div className="grid-link">
            <div className="icon-grid scan-icon"></div>
            <div className="grid-title">Scan Now</div>
          </div>
        </div>
        <div className="small-grids">
          <div className="small-grid" onClick={navigateToMap}>
            <div className="grid-link">
              <div className="icon-grid map-icon"></div>
              <div className="grid-title">Map</div>
            </div>
          </div>
          <div className="small-grid" onClick={navigateToHistory}>
            <div className="grid-link">
              <div className="icon-grid history-icon "></div>
              <div className="grid-title">History</div>
            </div>
          </div>
        </div>
      </div>
    </Layout1>
  );
};

export default Dashboard;
