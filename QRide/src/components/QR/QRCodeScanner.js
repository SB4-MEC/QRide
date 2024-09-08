import React, { useEffect, useState } from "react";
import { useZxing } from "react-zxing";
import { useNavigate } from "react-router-dom";
import "./Qr.css";
import bgdot from "../Assets/bgdot.png";
import bgdot1 from "../Assets/bgdot1.png";
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
  const [verified, setVerified] = useState(false); // New state for handling verification

  const toggleDropdown = () => {
    if (result) return;
    setDropdownOpen(!isDropdownOpen);
  };

  const handleDestinationSelect = (stop) => {
    setSelectedDestination(stop);
    console.log(selectedDestination);
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (selectedDestination) {
      navigate("/table", { state: { busStops } }); // Pass busStops data
    }
  }, [selectedDestination]); 

  useEffect(() => {
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
    width: "100vw",
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
        setVerified(true);
        setTimeout(toggleDropdown, 1000); 
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
    <div className={`background ${verified ? 'verified' : ''}`} style={backgroundStyle}>
      {result ? (
        <div></div>
      ) : (
        <div className={`video-container ${verified ? "slide-out" : ""}`}>
          <div className="red-line"></div>
          <video className="video" ref={ref} />
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>
          <p><span className="qr-text">Scan your QR!</span></p>
        </div>
      )}
    
      {result && (
        <div className="px-2">
          
        <div className="text-center text-black font-bold "  style={{ fontSize: '4rem' ,fontFamily: '"Open Sans", sans-serif' }} >Scanned Successfully!</div>
        <div className={`dropdown-container ${verified ? "fade-in" : ""}`}>
          
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
      )}
    </div>
  );
};

export default QRCodeScanner;
