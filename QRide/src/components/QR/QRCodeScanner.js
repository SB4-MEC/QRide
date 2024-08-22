import React, { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { useNavigate } from "react-router-dom";
import "./Qr.css";
import bgdot from "../Assets/bgdot.png";
import bgdot1 from "../Assets/bgdot1.png";
import Verify from "../Assets/verify.gif";
import { useBus } from "../../context/BusProvider";
import supabase from "../../config/supabaseClient";

const busStopTextCodes = {
  edapally: "EDAPPALLY",
  thrikkakara: "THRIKKAKARA",
  pipeline: "PIPELINE",
  ngo: "NGO",
  cusat: "CUSAT",
  // Add more text codes and their corresponding destinations
};

const QRCodeScanner = () => {
  const {
    selectedDestination,
    setSelectedDestination,
    currentLocation,
    setCurrentLocation,
  } = useBus();
  const navigate = useNavigate();
  const [result, setResult] = useState("");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [busStops, setBusStops] = useState([
    "EDAPPALLY",
    "THRIKKAKARA",
    "PIPELINE",
    "NGO",
    "CUSAT",
    // Add more bus stops as needed
  ]);

  const toggleDropdown = () => {
    // If a QR code has been scanned, do not toggle the dropdown
    if (result) {
      return;
    }

    setDropdownOpen(!isDropdownOpen);
  };

  const handleDestinationSelect = (stop) => {
    setSelectedDestination(stop);
    console.log(selectedDestination);
    setDropdownOpen(false);
  };
  
  useEffect(() => {
    if (selectedDestination) {
      navigate("/table");
    }
  }, [selectedDestination]); // Dependency array

  let backgroundImageUrl = `url(${bgdot})`;
  if (window.innerWidth <= 425) {
    backgroundImageUrl = `url(${bgdot1})`;
  }
  
  useEffect(() => {
    // Fetch bus stops on component mount
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

    fetchBusStops();
  }, []);
  
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
        alert(`Please scan the correct QR code`);
      } else {
        setCurrentLocation(busStopTextCodes[scannedText.toLowerCase()]);
        console.log(currentLocation);

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
      {result ? (
        <img src={Verify} alt="Verify" className="verify-gif" />
      ) : (
        <div className="video-container">
          <div className="red-line"></div> {/* Red line for scan effect */}
          <video className="video" ref={ref} />
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
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
                <a
                  key={index}
                  onClick={() => {
                    handleDestinationSelect(stop);
                  }}
                >
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
