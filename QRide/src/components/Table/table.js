import React, { useEffect, useState } from "react";
import Layout1 from "../Layout1/layout1";
import BusCard from "../BusCard"; // Import the BusCard component
import { useBus } from "../../context/BusProvider";
import supabase from "../../config/supabaseClient";
import "./Table.css"; // Import the new CSS file for custom styles

const Table = () => {
  const { currentLocation, selectedDestination, setSelectedDestination } = useBus();

  const [buses, setBuses] = useState([]);
  const [busStops, setBusStops] = useState([]);
  const [showSupabaseData, setShowSupabaseData] = useState(true);

  const fetchBusesFromAPI = async () => {
    try {
      const response = await fetch(`https://busapi.amithv.xyz/api/v1/schedules?departure=${currentLocation.toLowerCase()}&destination=${selectedDestination.toLowerCase()}`);
      const data = await response.json();
    
      console.log('API Response:', data); 

      if (Array.isArray(data)) {
        setBuses(data); 
      } else {
        console.error('Unexpected API response format:', data);
        setBuses([]);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
      setBuses([]);
    }
  };

  const fetchBusesFromSupabase = async () => {
    const getId = async (stopName) => {
      const { data, error } = await supabase
          .from("busstop")
          .select("stop_id")
          .eq("stop_name", stopName);
      
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

    try {
      const startId = await getId(currentLocation);
      const endId = await getId(selectedDestination);
      console.log(startId);
      console.log(endId);
      const { data: busrouteids, error } = await supabase
        .from("busroutes")
        .select("id")
        .contains("busroutes", [startId, endId]);

      if (busrouteids && busrouteids.length > 0) {
        console.log(busrouteids);
        
        const routeIds = busrouteids.map((route) => route.id);
        console.log(routeIds);

        const { data: buslist, error } = await supabase
          .from("busdetail")
          .select()
          .in("bus_route", routeIds);
        if (buslist) {
          console.log(buslist);
          setBuses(buslist);
        }
        if (error) {
          console.error(error);
        }
      } else {
        console.error("Error fetching buses:", error);
        setBuses([]); 
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  const fetchBusStops = async () => {
    let { data: busstops, error } = await supabase.from('busstop').select('stop_name');
    if (error) {
      console.error("Error retrieving bus stop data: ", error);
    } else {
      const sortedBusStops = busstops.sort((a, b) => a.stop_name.localeCompare(b.stop_name));
      const stopNames = sortedBusStops.map((busstop) => busstop.stop_name);
      setBusStops(stopNames);
    }
  };

  useEffect(() => {
    fetchBusStops(); // Fetch bus stops when the component mounts
  }, []);

  useEffect(() => {
    if (showSupabaseData) {
      fetchBusesFromSupabase();
    } else {
      fetchBusesFromAPI();
    }
  }, [currentLocation, selectedDestination, showSupabaseData]);

  const handleDestinationChange = (event) => {
    setSelectedDestination(event.target.value);
  };

  return (
    <Layout1>
      <div className=" ml-40 mt-10 px-4">
        <label htmlFor="destination" className="destination-label">Select Destination:</label>
        <select
          id="destination"
          value={selectedDestination}
          onChange={handleDestinationChange}
          className="destination-select"
        >
          {busStops.map((stop, index) => (
            <option key={index} value={stop}>{stop}</option>
          ))}
        </select>

        <button 
          onClick={() => setShowSupabaseData(true)} 
          className={`px-6 py-2 mr-2 ml-4 rounded-lg transition-all duration-300 ${showSupabaseData ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          Supabase Data
        </button>
        <button 
          onClick={() => setShowSupabaseData(false)} 
          className={`px-6 py-2 rounded-lg transition-all duration-300 ${!showSupabaseData ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          API Data
        </button>
      </div>

      <div className="flex flex-col justify-center ml-40 mt-10 px-4">
        {buses.length > 0 ? (
          buses.map((bus, index) => (
            <BusCard 
              key={index} 
              bus={bus} 
              currentLocation={currentLocation} 
              selectedDestination={selectedDestination} 
              className="bus-card w-full" 
            />
          ))
        ) : (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">No buses found!</strong>
            <span className="block sm:inline"> We couldn't find any buses for your route.</span>
          </div>
        )}
      </div>
    </Layout1>
  );
};

export default Table;
