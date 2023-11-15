import React, { useState } from "react";
import { useZxing } from "react-zxing";
import { useNavigate } from "react-router-dom";
import "./Qr.css";
import bgdot from "../Assets/bgdot.png";
import bgdot1 from "../Assets/bgdot1.png";
import supabase from "../../config/supabaseClient";
const busStopTextCodes = {
  edapally: "EDAPPALLY",
  thrikkakara: "Thrikkakara",
  pipeline: "Pipeline",
  ngo: "NGO",
  cusat: "CUSAT"
  // Add more text codes and their corresponding destinations
};

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [busStops, setBusStops] = useState([
    "Edappally",
    "Thrikkakara",
    "Pipeline",
    "NGO",
    "CUSAT",
    // Add more bus stops as needed
  ]);
  const [selectedDestination, setSelectedDestination] = useState("");

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleDestinationSelect = (stop) => {
    setSelectedDestination(stop);
    setDropdownOpen(false);

    // Now you can send the data to the backend or perform any other actions
    // For example, call a function to fetch buses based on current location and selected destination
    fetchBuses(result, stop);
  };

  const fetchBuses = async(currentLocation, selectedDestination) => {
    try {
      // Make a query to fetch buses based on destination and current bus stop
      const { data, error } = await supabase
        .from('buses')
        .select('*')
        .eq('destination', selectedDestination) // Filter buses by destination
        .eq('departure_bus_stop', currentLocation); // Filter buses by current bus stop
  
      if (error) {
        console.error('Error fetching buses:', error);
        // Handle error
        return [];
      }
      if (data) {
        // Buses matching the destination and current bus stop fetched successfully
        console.log('Buses:', data);
        return data; // Return fetched buses
      }
    } catch (error) {
      console.error('Error fetching buses:', error.message);
      // Handle error
      return [];
    }
    // Make a request to the backend API with the necessary data
    // Example using fetch API
    {/*fetch('/api/track-buses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentLocation,
        selectedDestination,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Handle the response from the backend
        console.log('Buses:', data);
      })
      .catch(error => {
        console.error('Error fetching buses:', error);
      });*/}
  };

  let backgroundImageUrl = `url(${bgdot})`;
  if (window.innerWidth <= 425) {
    backgroundImageUrl = `url(${bgdot1})`;
  }

  const backgroundStyle = {
    backgroundImage: backgroundImageUrl,
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      const scannedText = result.getText();
      setResult(scannedText);

      if (isValidURL(scannedText)) {
        // Handle other cases (non-URL, non-"Edappally") as needed
        alert(`Scanned: ${scannedText}. Please scan the correct QR code`);
      } else {
        // If the scanned QR is correct, initiate the dropdown menu
        toggleDropdown();
      }
    },
  });

  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="background" style={backgroundStyle}>
      <div className="video-container">
        <video className="video" ref={ref} />
        <p>
          <span className="qr-text">Scan your QR!</span>
        </p>
        <div className="dropdown-container">
          <button onClick={toggleDropdown} className="dropdown-button">
            Select Destination
          </button>

          {isDropdownOpen && (
            <div className="dropdown-content">
              {busStops.map((stop, index) => (
                <a key={index} onClick={() => handleDestinationSelect(stop)}>
                  {stop}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;
