// Table.js
import React, { useEffect, useState } from 'react';
import Layout1 from '../Layout1/layout1';
import supabase from '../../config/supabaseClient';
import BusCard from '../BusCard'; // Import the BusCard component

const Table = ({ startStopId, endStopId }) => {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const startId = getStopId(startStopId);
        const endId = getStopId(endStopId);
        const { data, error } = await supabase.from('busdetail').select('*').filter('start_stop_id', 'eq' ,startId).filter('end_stop_id', 'eq' ,endId
        );
        if (data) {
          setBuses(data);
        } else {
          console.error('Error fetching buses:', error);
        }
      } catch (error) {
        console.error('Error fetching buses:', error);
      }
    };
    if (startStopId && endStopId) {
    fetchBuses();
    }
  }, [startStopId, endStopId]);

  return (
    <Layout1>
      <div className="flex flex-col justify-center m-auto mt-[200]">
        {/* Map through buses and render BusCard for each */}
        {buses.map((bus) => (
          <BusCard key={bus.bus_id} bus={bus} className="bus-card w-full"/>
        ))}
      </div>
    </Layout1>
  );
};

function getStopId(stopName) {
  const stopIdMap = {
    edapally: 1,
    thrikkakara: 5,
    pipeline: 2,
    ngo: 4,
    cusat: 3,
  };
  return stopIdMap[stopName];
}
export default Table;