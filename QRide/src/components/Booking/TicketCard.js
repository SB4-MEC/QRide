import React from 'react';

const ticketCardStyles = {
  border: '2px dashed #b0d4d3',
  borderRadius: '8px',
  padding: '1rem',
  maxWidth: '450px',
  width: '100%',
  textAlign: 'left',
  backgroundColor: '#f7faf9',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  fontFamily: 'Arial, sans-serif',
  position: 'relative',
};

const headerStyles = {
  backgroundColor: '#4DB6AC',
  color: '#fff',
  padding: '0.5rem',
  borderRadius: '6px 6px 0 0',
  textAlign: 'center',
  fontSize: '1.125rem',
  fontWeight: 'bold',
};

const subHeaderStyles = {
  margin: '0.5rem 0',
  fontSize: '0.875rem',
  color: '#4DB6AC',
};

const detailContainerStyles = {
  borderRadius: '0 0 6px 6px',
  padding: '0.5rem',
};

const detailStyles = {
  fontSize: '0.875rem',
  marginBottom: '0.5rem',
  color: '#333',
};

const qrLogoStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  color: '#4DB6AC',
};

const TicketCard = ({ bookingDetails }) => {
  return (
    <div style={ticketCardStyles}>
      <div style={headerStyles}>
        QRide
      </div>
      <div style={subHeaderStyles}>Your Ticket</div>
      <div style={detailContainerStyles}>
        <div style={detailStyles}><strong>From:</strong> {bookingDetails.from_place}</div>
        <div style={detailStyles}><strong>To:</strong> {bookingDetails.to_place}</div>
        <div style={detailStyles}><strong>Bus Name:</strong> {bookingDetails.bus_name}</div>
        <div style={detailStyles}><strong>Departure Time:</strong> {bookingDetails.departure_time}</div>
        <div style={detailStyles}><strong>Total Price:</strong> ₹{bookingDetails.price}</div>
      </div>
    </div>
  );
};

export default TicketCard;
