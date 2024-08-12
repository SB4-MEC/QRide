// src/components/NotificationsList.js

import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationList.css"; // Style this new component as needed

const NotificationsList = () => {
  const navigate = useNavigate();
  
  // Example notifications array, replace with your actual data source
  const notifications = [
    "Bus from A to B will arrive soon.",
    "Bus from C to D has left.",
    // Add more notifications here
  ];

  return (
    <div className="notifications-list-container">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification}</li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default NotificationsList;
