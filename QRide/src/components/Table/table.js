// Table.js
import React, { useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import Layout1 from '../Layout1/layout1';
import supabase from '../../config/supabaseClient';
import BusCard from '../BusCard'; // Import the BusCard component

const Table = () => {
  const [buses, setBuses] = useState([]);
  const location = useLocation();
  const { startStop, endStop} = location.state;
  // let returnData;

  const getId = async (stopName) => {
    const { data, error } = await supabase
      .from('busstop')
      .select('stop_id')
      .eq('stop_name', stopName);

    if (error) {
      console.error(`Error fetching stop ID for ${stopName}: `, error);
      return null;
    }

    if (data && data.length > 0) {
      return data[0].stop_id;
    } else {
      console.warn(`No stop ID found for ${stopName}`);
      return null;
    }
  };
  
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        // const startId = startStop;
        // const endId = endStop;
        const startId = await getId(startStop);
        const endId = await getId(endStop);
        console.log(startId);
        console.log(endId);
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
    
    fetchBuses();
    
  }, [startStop, endStop]);


// const getListOfBuses = async (startStopId, endStopId) => {
//   const { data, error } = await supabase
//     .from('busdetail')
//     .select(`
//       bus_id,
//       bus_name,
//       timing,
//       bus_route (
//         id,
//         busroutes
//       ),
//       start_stop:busstop (stop_name),
//       end_stop:busstop (stop_name)
//     `)
//     .contains('bus_route:busroutes', [startStopId])
//     .contains('bus_route:busroutes', [endStopId]);

//   if (error) {
//     console.error('Error retrieving list of buses: ', error);
//     return [];
//   }

//   // Filter or sort your data as needed here
//   return data;
// };

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

export default Table;