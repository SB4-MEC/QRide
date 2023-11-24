// Table.js
import React, { useEffect, useState } from 'react';
import Layout1 from '../Layout1/layout1';
import supabase from '../../config/supabaseClient';
import BusCard from '../BusCard'; // Import the BusCard component

const Table = () => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
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
  }, []);

  return (
    <Layout1>
      <div className="flex flex-col justify-center mt-[200]">
      {/* Map through buses and render BusCard for each */}
      {buses.map((bus) => (
        <BusCard key={bus.bus_id} bus={bus} />
      ))}
      </div>
    </Layout1>
  );
};

export default Table;
