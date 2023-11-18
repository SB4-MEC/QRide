import React, { useEffect, useState } from 'react';
import Layout1 from '../Layout1/layout1';
import supabase from '../../config/supabaseClient';

const Table = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchBuses = async () => {
      try {
        const { data, error } = await supabase.from('busdetail').select('*');
        if (data) {
          setBuses(data);
        } else {
          console.error('Error fetching buses:', error);
        }
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };

    fetchBuses();
  }, []); // Empty dependency array ensures this effect runs once when the component mounts

  const tableStyle = {
    width: '80rem',
    borderCollapse: 'collapse',
    marginTop: '20px',
    margin: 'auto',
  };

  const headerStyle = {
    backgroundColor: 'black',
    color: '#ffffff',
    
  };

  const cellStyle = {
    padding: '12px',
    textAlign: 'left',
    borderBottom: '1px solid #dddddd',
  };

  const hoverStyle = {
    backgroundColor: '#f5f5f5',
  };

  return (
    <Layout1>
     
      <table style={tableStyle}>
        <thead style={headerStyle}>
          <tr>
            <th style={cellStyle}>Bus ID</th>
            <th style={cellStyle}>Bus Name</th>
            <th style={cellStyle}>Start Stop ID</th>
            <th style={cellStyle}>End Stop ID</th>
            <th style={cellStyle}>Timing</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.bus_id} style={hoverStyle}>
              <td style={cellStyle}>{bus.bus_id}</td>
              <td style={cellStyle}>{bus.bus_name}</td>
              <td style={cellStyle}>{bus.start_stop_id}</td>
              <td style={cellStyle}>{bus.end_stop_id}</td>
              <td style={cellStyle}>{bus.timing}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </Layout1>
  );
};

export default Table;
