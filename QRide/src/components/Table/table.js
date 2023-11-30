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
  let returnData;

  const getStopIdFromQRCode = async (scannedText) => {
    const { data, error } = await supabase
      .from('qrcode')
      .select('bus_stop_id')
      .eq('code', scannedText);
  
    if (error) {
      console.error('Error fetching stop ID from QR code: ', error);
      return null;
    }
    if(data){
      returnData = data?.[0]?.bus_stop_id;
      return returnData;
    }
    

  };

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const startId = startStop;
        const endId = endStop;
        console.log(startStop);
        console.log(endStop);
        const { data, error } = await supabase.from('busdetail').select('*').filter('start_stop_id', 'eq' ,startStop).filter('end_stop_id', 'eq' ,endStop
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
    
  }, []);

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