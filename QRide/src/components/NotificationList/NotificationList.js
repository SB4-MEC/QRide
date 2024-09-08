import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
import supabase from '../../config/supabaseClient'; // Import your Supabase client configuration
import "./NotificationList.css"; // Style this new component as needed

const socket = io('http://localhost:4000'); // Connect to your server

const NotificationsList = ({ userId }) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch initial notifications from the Supabase table for the specific user
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId); // Filter by user_id

        if (error) throw error;

        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    // Listen for real-time notifications from the server and update the list
    socket.on('notification', (message) => {
      if (message.user_id === userId) { // Only handle notifications for this user
        setNotifications((prevNotifications) => [message, ...prevNotifications]);
      }
    });

    return () => {
      socket.off('notification');
    };
  }, [userId]);

  return (
    <div className="notifications-list-container">
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index}>{notification.message}</li> // Assuming notification object has a message field
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
};

export default NotificationsList;
