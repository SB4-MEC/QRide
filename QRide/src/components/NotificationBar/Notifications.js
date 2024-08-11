import React, { useState, useEffect } from 'react';
import { useBooking } from '../../context/BookingContext';

const BusNotifications = () => {
  const { bookingDetails } = useBooking();
  const [notification, setNotification] = useState('');
  const [counter, setCounter] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (!bookingDetails) return;

    const { from, to, time } = bookingDetails;

    const calculateTimeDifference = (busTime) => {
      const now = new Date();
      const busArrivalTime = new Date(`${now.toDateString()} ${busTime}`);
      const timeDifference = busArrivalTime - now; // Time difference in milliseconds
      return timeDifference / 60000; // Convert to minutes
    };

    const timeDifference = calculateTimeDifference(time);

    if (timeDifference < 0) {
      setNotification(`The bus from ${from} to ${to} has already left.`);
      setShowNotification(true);
    } else if (timeDifference) {
      setNotification(`The bus from ${from} to ${to} will arrive in the next ${Math.ceil(timeDifference)} minutes!`);
      setCounter(Math.ceil(timeDifference));
      setShowNotification(true);
      
      const intervalId = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter > 0) {
            return prevCounter - 1;
          }
          clearInterval(intervalId); // Stop the interval when counter reaches zero
          return 0;
        });
      }, 60000); // Update every minute

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    } else {
      setShowNotification(false); // Explicitly hide if condition is not met
    }
  }, [bookingDetails]);

  useEffect(() => {
    let timeoutId;
    if (showNotification) {
      timeoutId = setTimeout(() => setShowNotification(false), 5000); // Hide notification after 5 seconds
    }
    return () => clearTimeout(timeoutId);
  }, [showNotification, notification]);

  const notificationBarStyles = {
    padding: '1rem',
    borderRadius: '5px',
    textAlign: 'center',
    marginTop: '1rem',
    fontSize: '1.2rem',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f44336',
    color: '#fff',
    transition: 'opacity 0.5s ease-in-out',
    opacity: showNotification ? 1 : 0,
  };

  return (
    <div 
     className={`notification-bar`} 
     style={notificationBarStyles}>
      {notification && <p>{`${notification}${counter !== null ? ` (${counter} minutes left)` : ''}`}</p>}
    </div>
  );
};

export default BusNotifications;
