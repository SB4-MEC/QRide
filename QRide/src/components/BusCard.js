import React, { useState, useEffect } from 'react';
import heart_1 from './Assets/heart.png';
import heart_3 from './Assets/heart3.png';
import { useBus } from '../context/BusProvider';
import { useNavigate } from 'react-router';

const BusCard = ({ bus, currentLocation, selectedDestination }) => {
  const [timeMessage, setTimeMessage] = useState('');
  const [whiteHeartVisible, setWhiteHeartVisible] = useState(true);
  const [redHeartVisible, setRedHeartVisible] = useState(false);
  const [ticketPrice, setTicketPrice] = useState('N/A');

  const { currentBusIds, setCurrentBusIds } = useBus();
  const navigate = useNavigate();

  const MINIMUM_PRICE = 10; // Example minimum price
  const PRICE_PER_KM = 5; // Example price per kilometer

  // Function to fetch distance between currentLocation and selectedDestination
  const getDistanceBetweenPlaces = (origin, destination) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) {
        reject('Google Maps JavaScript API not loaded');
        return;
      }

      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: window.google.maps.TravelMode.DRIVING,
        unitSystem: window.google.maps.UnitSystem.METRIC,
      }, (response, status) => {
        if (status === window.google.maps.DistanceMatrixStatus.OK) {
          const distanceInMeters = response.rows[0].elements[0].distance.value;
          const distanceInKm = distanceInMeters / 1000; // Convert to kilometers
          resolve(distanceInKm);
        } else {
          reject('Could not retrieve distance data');
        }
      });
    });
  };

  // Function to calculate and set the ticket price
  const calculateTicketPrice = async () => {
    try {
      const distance = await getDistanceBetweenPlaces(currentLocation, selectedDestination);
      const calculatedPrice =(distance * PRICE_PER_KM);
      const finalPrice = Math.max(MINIMUM_PRICE, calculatedPrice); // Use MAXIMUM_VALUE to ensure minimum price

      setTicketPrice(finalPrice.toFixed(0)); // Round to 2 decimal places
    } catch (error) {
      console.error('Error calculating ticket price:', error);
      setTicketPrice('N/A');
    }
  };

  useEffect(() => {
    calculateTicketPrice(); // Calculate the price when component mounts
  }, [currentLocation, selectedDestination]);

  const handleBusClick = () => {
    navigate('/booking', { state: { bus, currentLocation, selectedDestination } });
  };

  const handleWhiteHeartClick = () => {
    setWhiteHeartVisible(false);
    setRedHeartVisible(true);
    addFavourite(bus.bus_name);
    setCurrentBusIds(prevData => [...prevData, bus.vehicle_number]);
  };

  const handleRedHeartClick = () => {
    setWhiteHeartVisible(true);
    setRedHeartVisible(false);
    // Implement removing from favourites if needed
  };

  const addFavourite = async (vehicleNumber) => {
    console.log('Adding to favourites:', vehicleNumber);
  };

  const convertTo24HourFormat = (time12) => {
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'pm' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'am' && hours === '12') {
      hours = '00';
    }
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    const systemTime = new Date();
    const nextDeparture = bus.stations && bus.stations[0].arrivalTime;
    if (nextDeparture) {
      const convertedTime = convertTo24HourFormat(nextDeparture);
      const busTime = new Date();
      const [hours, minutes] = convertedTime.split(':');
      busTime.setHours(parseInt(hours, 10));
      busTime.setMinutes(parseInt(minutes, 10));
      busTime.setSeconds(0);

      const differenceInMillis = busTime.getTime() - systemTime.getTime();
      if (differenceInMillis < 0) {
        setTimeMessage(`Your bus has left at ${busTime.toLocaleTimeString()}`);
      } else {
        setTimeMessage(`Arrives at ${busTime.toLocaleTimeString()}`);
      }
    }
  }, [bus]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 w-full flex flex-col">
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col w-1/6">
          <span className="text-l text-gray-500">Bus : {bus.vehicle_number} {bus.bus_name}</span>
        </div>
        <div className="text-green-600 font-bold text-xl">
          {timeMessage}
        </div>
        <div className="flex flex-col items-start w-1/8">
          <span className="text-sm text-gray-500">{currentLocation}</span>
        </div>
        <div className="flex flex-col items-start w-1/8">
          <span className="text-sm text-gray-500">{selectedDestination}</span>
        </div>
        <div className="flex flex-col w-1/8 text-right">
          <div className="text-green-600 font-bold text-xl">
            ₹{ticketPrice}
          </div>
        </div>
        <div className="flex flex-col items-end w-1/8">
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
        <button onClick={handleBusClick} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
          BOOK NOW
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
