import React from 'react';

const ticketCardStyles = {
  border: '4px solid #c9e9e1',
  borderRadius: '1rem',
  padding: '1rem',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const detailStyles = {
  fontSize: '1rem',
  marginBottom: '0.5rem',
  color: '#333',
};

const TicketCard = ({ bookingDetails }) => {
  return (
    <div style={ticketCardStyles}>
      <h2 style={{ marginBottom: '1rem', fontSize:'medium',fontWeight:'bold'}}>Your Ticket</h2>
      <div style={detailStyles}><strong>From:</strong> {bookingDetails.from_place}</div>
      <div style={detailStyles}><strong>To:</strong> {bookingDetails.to_place}</div>
      <div style={detailStyles}><strong>Bus Name:</strong> {bookingDetails.bus_name}</div>
      <div style={detailStyles}><strong>Departure Time:</strong> {bookingDetails.departure_time}</div>
      <div style={detailStyles}><strong>Total Price:</strong> ₹{bookingDetails.price}</div>
    </div>
  );
};

export default TicketCard;
