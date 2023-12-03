import React, { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { useNavigate } from "react-router-dom";
import "./Qr.css";
import bgdot from "../Assets/bgdot.png";
import bgdot1 from "../Assets/bgdot1.png";
import Verify from "../Assets/verify.gif";
// import supabase from "../../config/supabaseClient";
const busStopTextCodes = {
  edapally: "EDAPPALLY",
  thrikkakara: "THRIKKAKARA",
  pipeline: "PIPELINE",
  ngo: "NGO",
  cusat: "CUSAT",
  // Add more text codes and their corresponding destinations
};

const QRCodeScanner = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [busStops, setBusStops] = useState([
    "EDAPALLY",
    "THRIKKAKARA",
    "PIPELINE",
    "NGO",
    "CUSAT",
    // Add more bus stops as needed
  ]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [bus, setBuses] = useState([{}]);

  const toggleDropdown = () => {
    // If a QR code has been scanned, do not toggle the dropdown
    if (result) {
      return;
    }

    setDropdownOpen(!isDropdownOpen);
  };

  

  const handleDestinationSelect = (stop) => {
    setSelectedDestination(stop);
    setDropdownOpen(false);
  };
 // Add this useEffect hook in your component
useEffect(() => {
  if (selectedDestination) {
    // console.log(currentLocation);
    // console.log(selectedDestination);
    // fetchBuses(result, stop);
    navigate("/table", {
      state: {
        startStop: currentLocation,
        endStop: selectedDestination
      }
    });
  }
}, [selectedDestination]); // Dependency array
  
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
        alert(`Please scan the correct QR code`);
      } else {
        setCurrentLocation(busStopTextCodes[scannedText.toLowerCase()]);
        
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
         {result?(
        
          <img src={Verify} alt="Verify" className="verify-gif" />
        ):(
          <div className="video-container">
            <video className="video" ref={ref} />
            <p>
              <span className="qr-text">Scan your QR!</span>
            </p>
          </div>
        )}

        {result && (
          <div className="dropdown-container">
            <button onClick={toggleDropdown} className="dropdown-button">
              Select Destination
            </button>

            {isDropdownOpen && (
              <div className="dropdown-content">
                {busStops.map((stop, index) => (
                  <a key={index} onClick={() => {handleDestinationSelect(stop)}}>
                    {stop}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    
  );
};


export default QRCodeScanner;




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



