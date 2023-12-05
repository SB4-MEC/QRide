// BusCard.js
import React from 'react';

const BusCard = ({ bus, currentLocation, selectedDestination }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-[80rem] fle flex-col items-center justify-center">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          {/* <span className="text-sm text-gray-500">Bus ID: {bus.bus_id}</span> */}
          <span className="text-l text-gray-500">Bus Name: {bus.bus_name}</span>
        </div>
        <div className="text-green-600 font-bold text-xl">12:30</div>
        {/* <div className="text-sm">
          <div className="text-gray-500">duration</div>
          <div className="text-gray-500">departure_time</div>
        </div> */}
        <div className="flex flex-col items-start">
          {/* <span className="text-sm text-gray-500">date</span> */}
          <span className="text-sm text-gray-500">{currentLocation}</span>
        </div>
        <div className="flex flex-col items-start">
          {/* <span className="text-sm text-gray-500">bus_number</span> */}
          <span className="text-sm text-gray-500">{selectedDestination}</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            {/* <span className="bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
              {bus.rating}
            </span> */}
            {/* <span className="text-sm text-gray-500">Fare</span> */}
          </div>
          <div className="text-green-600 font-bold text-xl">{bus.price}/KM</div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500">45 Seats</span>
          {/* <span className="text-sm text-gray-500"> single</span> */}
        </div>
        
      </div>
      <div className="flex items-center justify-between mt-2">
  <div className="flex items-center space-x-2">  
    <i className="fas fa-wifi text-gray-400"></i>
    <i className="fas fa-utensils text-gray-400"></i>
    <i className="fas fa-glass-martini text-gray-400"></i>
    <i className="fas fa-toilet text-gray-400"></i>
    <i className="fas fa-charging-station text-gray-400"></i>
    <span className="text-sm text-blue-500 border border-blue-500 py-0.5 px-2 rounded">Safety+</span>
    <span className="text-sm text-blue-500 border border-blue-500 py-0.5 px-2 rounded">Live Tracking</span>
  </div>
  <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
      BOOK NOW
  </button>
</div>

      <div className="flex items-center justify-start space-x-4 mt-2">
        <span className="text-sm text-gray-500 cursor-pointer">Safety+</span>
        <span className="text-sm text-gray-500 cursor-pointer">Amenities</span>
        <span className="text-sm text-gray-500 cursor-pointer">Bus Photos</span>
        <span className="text-sm text-gray-500 cursor-pointer">Boarding & Dropping Points</span>
        <span className="text-sm text-gray-500 cursor-pointer">Reviews</span>
        <span className="text-sm text-gray-500 cursor-pointer">Booking policies</span>
      </div>
    </div>
  );
};

export default BusCard;
