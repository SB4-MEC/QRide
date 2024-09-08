import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from "../../config/supabaseClient";
import Layout1 from '../Layout1/layout1';
import CreditModal from './CreditModal';
import { useBooking } from "../../context/BookingContext.js";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import TicketCard from './TicketCard';

const BusTicketBooking = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setBookingDetails } = useBooking();

  const { bus, currentLocation, selectedDestination,ticketPrice } = state || {};
  console.log("this is bus:",bus);
  // User data and other states initialization
  const [userData, setUserData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    credits: 0,
  });
  const [ticketCount, setTicketCount] = useState(1);
  const [price, setPrice] = useState(ticketPrice || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);
  const [bookingDetails, setBookingDetailsState] = useState({
    user_id: null,
    bus_id: null,
    bus_name: "",
    from_place: "",
    to_place: "",
    departure_time: "",
    price: null,
    payment_status: "",
    number: null,
    other_details: null,
  });
  
  const totalCreditsRequired = price * 2;

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
            .select("first_name, last_name,user_id,credits") 
            .eq("user_id", userId);

          if (nameerror) throw nameerror;

          if (namedata && namedata.length > 0) {
            console.log(namedata);
            setUserData(prevData => ({
              ...prevData,
              first_name: namedata[0].first_name,
              last_name: namedata[0].last_name,
              user_id: namedata[0].user_id,
              credits: namedata[0].credits,
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching email:", error.message);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (bus && ticketPrice) {
      setPrice(ticketPrice * ticketCount);
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

  const handleCardPaymentClick = () => {
    navigate('/payment-page', {
      state: {
        userData,
        bus,
        currentLocation,
        selectedDestination,
        ticketCount,
        price
      }
    });
  };

  const handleCreditPaymentClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmCreditPayment = async () => {
    try {
      const userId = userData.user_id;
      if (userData.credits >= totalCreditsRequired) {
        const updatedCredits = userData.credits - totalCreditsRequired;
  
        const { error: updateError } = await supabase
          .from('user_details')
          .update({ credits: updatedCredits })
          .eq('user_id', userId);
  
        if (updateError) throw new Error(`Update Error: ${updateError.message}`);
  
        setUserData(prev => ({ ...prev, credits: updatedCredits }));
  
        // Prepare booking details for insertion
        const bookingPayload = {
          user_id: userId,
          bus_id: bus.bus_id,
          bus_name: bus.bus_name || bus.vehicle_number,
          departure_time: bus.stations[0].arrivalTime,
          from_place: currentLocation,
          to_place: selectedDestination,
          price: price,
          payment_status: 'Paid',
          number: ticketCount,
          other_details: JSON.stringify({ seat_number: 'A1' }),
        };
  
        // Log the booking details being sent to the database
        console.log("Inserting Booking Payload:", bookingPayload);
  
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .insert([bookingPayload])
          .single(); // Fetch the created booking data
  
        if (bookingError) throw new Error(`Booking Error: ${bookingError.message}`);
  
        // Log the response from the database
        console.log("Booking Data:", bookingData);
  
        setBookingDetailsState(bookingPayload);
        console.log(bookingDetails);
        setIsBookingSuccessful(true); // Set booking success state
  
        alert('Payment Successful');
      } else {
        alert('Not enough credits');
      }
    } catch (error) {
      console.error("Error updating credits or creating booking:", error.message);
      alert(`Failed to process payment: ${error.message}`);
    } finally {
      setIsModalOpen(false);
    }
  };
  

  const handleDownloadTicket = () => {
    const ticketArea = document.querySelector("#ticket-card-area");
    if (!ticketArea) {
      console.error("Element with id 'ticket-card-area' not found.");
      return;
    }
    console.log("Element found:", ticketArea);

    html2canvas(ticketArea).then(canvas => {
      canvas.toBlob(blob => {
        saveAs(blob, "ticket.png");
      });
    }).catch(err => console.error("Error capturing the ticket area:", err));
  };


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
    lineHeight: '1.6',
  };

  const buttonStyles = {
    padding: '0.75rem 2rem',
    fontSize: '1.1rem',
    color: '#ffffff',
    maxWidth:'50%',
    minWidth:'50%',
    backgroundColor: '#28a745',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    letterSpacing: '0.06rem',
    margin: '.5rem',
    textAlign:'center',
    font:'medium'
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
    gap: '0.5rem',
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

  return (
    <Layout1>
      <div style={containerStyles}>
        <h1 style={headingStyles}>Bus Ticket Booking</h1>
        <div style={detailContainerStyles}>
          <div style={detailStyles}><strong>From:</strong> {currentLocation}</div>
          <div style={detailStyles}><strong>To:</strong> {selectedDestination}</div>
          <div style={detailStyles}><strong>Bus Name:</strong> {bus.bus_name || bus.vehicle_number}</div>
          <div style={detailStyles}><strong>Departure Time:</strong> {bus.stations[0].arrivalTime}</div>
          <div style={detailStyles}><strong>Price per Ticket:</strong> ₹{ticketPrice}</div>
          <div style={detailStyles}><strong>Total Price:</strong> ₹{price}</div>
        </div>
        <div style={counterStyles}>
          <button
            style={counterButtonStyles}
            onClick={() => {
              setTicketCount(prev => Math.max(1, prev - 1));
              setPrice(ticketPrice * (Math.max(1, ticketCount - 1)));
            }}
          >
            -
          </button>
          <span>{ticketCount}</span>
          <button
            style={counterButtonStyles}
            onClick={() => {
              setTicketCount(prev => Math.min(10, prev + 1));
              setPrice(ticketPrice * (Math.min(10, ticketCount + 1)));
            }}
          >
            +
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            style={buttonStyles}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyles.backgroundColor} 
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyles.backgroundColor}
            onClick={handleCardPaymentClick}
          >
            Card Payment
          </button>
          <button
            style={buttonStyles}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyles.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = buttonStyles.backgroundColor}
            onClick={handleCreditPaymentClick}
          >
            Pay Using App Credits
          </button>
        </div>

        {/* Conditionally render the modal or booking success message */}
        {isBookingSuccessful ? (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <h2>Booking Successful!</h2>
            <button
              style={{ ...buttonStyles, backgroundColor: '#007bff', marginTop: '1rem',padding:'1rem',maxWidth:'15rem'}}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
              onClick={handleDownloadTicket}
            >
              Download Ticket
            </button>
          </div>
        ) : (
          <CreditModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            totalCredits={totalCreditsRequired}
            handleConfirm={handleConfirmCreditPayment}
          />
        )}

        {/* Conditionally render the ticket card if booking is successful and paid with credits */}
        {isBookingSuccessful && bookingDetails.payment_status === 'Paid' && (
          <div id="ticket-card-area" style={{ marginTop: '2rem' }}>
            <TicketCard bookingDetails={bookingDetails} />
          </div>
        )}
      </div>
    </Layout1>
  );
};

export default BusTicketBooking;

