import React, { useState, useEffect } from "react";
import heart_1 from "./Assets/heart.png";
import heart_3 from "./Assets/heart3.png";
import supabase from "../config/supabaseClient";
import { useBus } from "../context/BusProvider";
import { useNavigate } from "react-router";

const BusCard = ({ bus, currentLocation, selectedDestination }) => {
  const [timeMessage, setTimeMessage] = useState("");
  const [whiteHeartVisible, setWhiteHeartVisible] = useState(true);
  const [redHeartVisible, setRedHeartVisible] = useState(false);
  const [busId, setBusId] = useState();
  const { currentBusIds, setCurrentBusIds } = useBus();
  
  const navigate=useNavigate();
  const navigatetoBooking=()=>{
    navigate("/booking")
  }
  const handleWhiteHeartClick = () => {
    setBusId(bus.bus_id);
    setWhiteHeartVisible(false);
    setRedHeartVisible(true);

    const currentBusId = busId;
    addFavourite(currentBusId);
    setCurrentBusIds((prevData) => [...prevData, currentBusId]);
  };

  const addFavourite = async (currentBusId) => {
    const { data, error } = await supabase
      .from("busdetail")
      .update({ favourite: "1" })
      .eq("bus_id", currentBusId);

    if (data) {
      console.log(data);
    }
  };

  const handleRedHeartClick = () => {
    setWhiteHeartVisible(true);
    setRedHeartVisible(false);
    // Implement removing from favourites table if needed.
  };

  useEffect(() => {
    const systemTime = new Date();
    const busTimeFromDatabase = bus.timing || "";
    console.log(busTimeFromDatabase);
    if (busTimeFromDatabase) {
      const busTimeSplit = busTimeFromDatabase.split(":");
      const busTime = new Date();
      busTime.setHours(parseInt(busTimeSplit[0], 10));
      busTime.setMinutes(parseInt(busTimeSplit[1], 10));
      busTime.setSeconds(parseInt(busTimeSplit[2], 10));

      const differenceInMillis = busTime.getTime() - systemTime.getTime();

      if (differenceInMillis < 0) {
        setTimeMessage(`Your bus has left at ${busTime.toLocaleTimeString()}`);
      } else {
        setTimeMessage(`Arrives at ${busTime.toLocaleTimeString()}`);
      }
    }
  }, [bus.timing]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full flex flex-col items-center justify-center">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <span className="text-l text-gray-500">Bus Name: {bus.bus_name}</span>
        </div>
        <div className="text-green-600 font-bold text-xl">
          {timeMessage}
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm text-gray-500">{currentLocation}</span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-sm text-gray-500">{selectedDestination}</span>
        </div>
        <div className="flex flex-col">
          <div className="text-green-600 font-bold text-xl">
            ₹{bus.price}/KM
          </div>
        </div>
        <div className="flex flex-col items-end">
          {whiteHeartVisible && (
            <img
              src={heart_3}
              alt="White Heart"
              onClick={handleWhiteHeartClick}
            />
          )}
          {redHeartVisible && (
            <img src={heart_1} alt="Red Heart" onClick={handleRedHeartClick} />
          )}
          <span className="text-sm text-gray-500">45 Seats</span>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 w-full">
        <div className="flex items-center space-x-2">
          <i className="fas fa-wifi text-gray-400"></i>
          <i className="fas fa-utensils text-gray-400"></i>
          <i className="fas fa-glass-martini text-gray-400"></i>
          <i className="fas fa-toilet text-gray-400"></i>
          <i className="fas fa-charging-station text-gray-400"></i>
          <span className="text-sm text-blue-500 border border-blue-500 py-0.5 px-2 rounded">
            Safety+
          </span>
          <span className="text-sm text-blue-500 border border-blue-500 py-0.5 px-2 rounded">
            Live Tracking
          </span>
        </div>
        <button onClick={navigatetoBooking} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          BOOK NOW{" "}
        </button>
      </div>
      <div className="flex items-center justify-start space-x-4 mt-2 w-full">
        <span className="text-sm text-gray-500 cursor-pointer">Safety+</span>
        <span className="text-sm text-gray-500 cursor-pointer">Amenities</span>
        <span className="text-sm text-gray-500 cursor-pointer">Bus Photos</span>
      </div>
    </div>
  );
};

export default BusCard;
