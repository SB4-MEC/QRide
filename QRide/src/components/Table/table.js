import React, { useEffect, useState } from "react";
import Layout1 from "../Layout1/layout1";
import supabase from "../../config/supabaseClient";
import BusCard from "../BusCard"; // Import the BusCard component
import { useBus } from "../../context/BusProvider";

const Table = () => {
  const { currentLocation, selectedDestination, buses, setBuses } = useBus();

  const getId = async (stopName) => {
    const { data, error } = await supabase
      .from("busstop")
      .select("stop_id")
      .eq("stop_name", stopName);
    
      console.log(data)

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
          
          // to get the array of busrouteids from busrouteids
          const routeIds = busrouteids.map((route) => route.id);
          console.log(routeIds);

          //retrieving bus details of all the bus route ids present in busrouteidArray

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

    fetchBuses();
    
  }, [currentLocation, selectedDestination]);

  
  return (
    <Layout1>
      <div className="flex flex-col justify-center ml-40 mt-[200] w-[120rem] px-4">
        {/* Check if there are any buses to display */}
        {buses.length > 0 ? (
          // If buses exist, map through them and render BusCard for each
          buses.map((bus) => (
            <BusCard 
              key={bus.bus_id} 
              bus={bus} 
              currentLocation={currentLocation} 
              selectedDestination={selectedDestination} 
              className="bus-card w-full" 
            />
          ))
        ) : (
          // If no buses are found, render a message instead
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
