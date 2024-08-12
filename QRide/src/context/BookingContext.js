// BookingContext.js
import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
console.log(bookingDetails)
  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails }}>
      {children}
      
    </BookingContext.Provider>
  );
};
