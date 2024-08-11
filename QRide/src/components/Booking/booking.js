import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from "../../config/supabaseClient"; // Import your Supabase client
import Layout1 from '../Layout1/layout1';
import { useBooking } from "../../context/BookingContext.js";

const BusTicketBooking = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setBookingDetails } = useBooking(); // Use the setBookingDetails function from context

  const { bus, currentLocation, selectedDestination } = state || {};

  // User data and other states initialization
  const [userData, setUserData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
  });

  const [ticketCount, setTicketCount] = useState(1); // Initialize ticket count to 1
  const [price, setPrice] = useState(bus?.price || 0); // Initialize price with bus price or 0

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) throw error;

        if (user) {
          console.log(user);
          setUserData({
            email: user.email,
            name: user.user_metadata.name,
          });

          const userId = user.id;
          const { data: namedata, error: nameerror } = await supabase
            .from("user_details")
            .select("first_name, last_name,user_id")
            .eq("user_id", userId);

          if (nameerror) throw nameerror;

          if (namedata && namedata.length > 0) {
            console.log(namedata);
            setUserData(prevData => ({
              ...prevData,
              first_name: namedata[0].first_name,
              last_name: namedata[0].last_name,
              user_id: namedata[0].user_id,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching email:", error.message);
      }
    };

    fetchUser();
  }, []);

  // Update the price based on the ticket count
  useEffect(() => {
    if (bus && bus.price) {
      setPrice(bus.price * ticketCount);
    }
  }, [bus, ticketCount]);

  if (!bus) {
    return (
      <Layout1>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h2>No bus details available. Please go back and select a bus.</h2>
        </div>
      </Layout1>
    );
  }

  // Handle payment process
  const handlePayment = async () => {
    if (!bus || !bus.bus_id) {
      console.error('Selected bus details are missing.');
      alert('Error: Selected bus details are missing. Please go back and select a bus.');
      return;
    }

    const bookingDate = new Date();

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: userData.user_id,
            bus_id: bus.bus_id,
            bus_name: bus.bus_name,
            from_place: currentLocation,
            to_place: selectedDestination,
            // booking_date: bookingDate,
            price: price,
            payment_status: 'Paid',
            number: ticketCount, // Add the ticket count here
            other_details: {
              seat_number: 'A1', // Example detail, adjust as necessary
              // bus_type: selectedBus.type, // Example detail, adjust as necessary
            },
          },
        ]);

      if (error) {
        console.error('Error recording booking:', error);
      } else {
        console.log('Booking recorded successfully:', data);
        setBookingDetails({ from: currentLocation, to: selectedDestination, time: bus.timing });
        // Navigate to a confirmation page
        {/*navigate('/booking-confirmation');*/}
      }
    } catch (error) {
      console.error('Error during payment process:', error);
    }
  };

  // Styles for the component
  const containerStyles = {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '2rem',
    border: '3px solid #c9e9e1',
    borderRadius: '1rem',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Arial, sans-serif',
  };

  const headingStyles = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '1.5rem',
    textAlign: 'center',
    letterSpacing: '0.05rem',
  };

  const detailContainerStyles = {
    width: '100%',
    marginBottom: '1.5rem',
    padding: '0.75rem',
    backgroundColor: '#f1f3f4',
    borderRadius: '0.5rem',
  };

  const detailStyles = {
    fontSize: '1.25rem',
    color: '#444',
    marginBottom: '0.5rem',
    lineHeight: '1.6',
  };

  const buttonStyles = {
    padding: '0.75rem 2rem',
    fontSize: '1.1rem',
    color: '#ffffff',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    letterSpacing: '0.05rem',
  };

  const buttonHoverStyles = {
    backgroundColor: '#218838',
  };

  const counterStyles = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1.5rem',
    width: '100%',
    gap: '0.5rem' // Adjusted gap between counter buttons
  };

  const counterButtonStyles = {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    color: '#ffffff',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  console.log('State:', state);
  console.log('Bus:', bus);
  console.log('Current Location:', currentLocation);
  console.log('Selected Destination:', selectedDestination);

  return (
    <Layout1>
      <div style={containerStyles}>
        <h1 style={headingStyles}>Bus Ticket Booking</h1>
        <div style={detailContainerStyles}>
          <div style={detailStyles}><strong>From:</strong> {currentLocation}</div>
          <div style={detailStyles}><strong>To:</strong> {selectedDestination}</div>
          <div style={detailStyles}><strong>Bus Name:</strong> {bus.bus_name}</div>
          <div style={detailStyles}><strong>Departure Time:</strong> {bus.timing}</div>
          <div style={detailStyles}><strong>Price per Ticket:</strong> ₹{bus.price}</div>
          <div style={detailStyles}><strong>Total Price:</strong> ₹{price}</div>
        </div>
        <div style={counterStyles}>
          <button
            style={counterButtonStyles}
            onClick={() => {
              setTicketCount((prev) => Math.max(1, prev - 1));
              setPrice(bus.price * (Math.max(1, ticketCount - 1)));
            }}
          >
            -
          </button>
          <span>{ticketCount}</span>
          <button
            style={counterButtonStyles}
            onClick={() => {
              setTicketCount((prev) => Math.min(10, prev + 1));
              setPrice(bus.price * (Math.min(10, ticketCount + 1)));
            }}
          >
            +
          </button>
        </div>
        <button
          style={buttonStyles}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyles.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyles.backgroundColor}
          onClick={handlePayment}
        >
          Proceed to Payment
        </button>
      </div>
    </Layout1>
  );
};

export default BusTicketBooking;
