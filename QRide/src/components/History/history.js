import React, { useState, useEffect } from 'react';
import supabase from "../../config/supabaseClient";
import Layout1 from '../Layout1/layout1';

const History = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    user_id: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) throw error;

        if (user) {
          setUserData({
            email: user.email,
            name: user.user_metadata.name,
          });

          const userId = user.id;
          const { data: namedata, error: nameerror } = await supabase
            .from("user_details")
            .select("first_name, last_name, user_id")
            .eq("user_id", userId);

          if (nameerror) throw nameerror;

          if (namedata && namedata.length > 0) {
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

  useEffect(() => {
    if (userData.user_id) {
      const fetchBookings = async () => {
        try {
          const { data, error } = await supabase
            .from('bookings')
            .select('*') 
            .eq('user_id', userData.user_id)
            .order('booking_date', { ascending: false });

          if (error) throw error;
          setBookings(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }
  }, [userData.user_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Layout1>
      <div style={containerStyles}>
        <h1 style={headingStyles}>Booking History</h1>
        {bookings.length > 0 ? (
          <table style={tableStyles}>
            <thead>
              <tr>
                <th style={headerCellStyles}>Bus Name</th>
                <th style={headerCellStyles}>From Place</th>
                <th style={headerCellStyles}>To Place</th>
                <th style={headerCellStyles}>Booking Date</th>
                <th style={headerCellStyles}>No. Of Tickets</th>
                <th style={headerCellStyles}>Price</th>
                <th style={headerCellStyles}>Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} style={rowStyles}>
                  <td style={cellStyles}>{booking.bus_name}</td>
                  <td style={cellStyles}>{booking.from_place}</td>
                  <td style={cellStyles}>{booking.to_place}</td>
                  <td style={cellStyles}>{new Date(booking.booking_date).toLocaleString()}</td>
                  <td style={cellStyles}>{booking.number}</td>
                  <td style={cellStyles}>₹{booking.price}</td>
                  <td style={cellStyles}>{booking.payment_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </Layout1>
  );
};

const containerStyles = {
  maxWidth: '1000px',
  margin: '2rem auto',
  padding: '2rem',
  border: '1px solid #e0e0e0',
  borderRadius: '0.75rem',
  backgroundColor: '#fafafa',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const headingStyles = {
  fontSize: '2.5rem',
  fontWeight: '600',
  color: '#333',
  marginBottom: '1.5rem',
  textAlign: 'center',
};

const tableStyles = {
  width: '100%',
  borderCollapse: 'collapse',
};

const headerCellStyles = {
  padding: '1rem',
  backgroundColor: '#f4f4f4',
  color: '#555',
  borderBottom: '2px solid #ddd',
  textAlign: 'center',  // Center align headers
  fontWeight: 'bold',
};

const rowStyles = {
  borderBottom: '1px solid #ddd',
};

const cellStyles = {
  padding: '0.75rem',
  textAlign: 'center',   // Center align cell content
  color: '#666',
};

export default History;
