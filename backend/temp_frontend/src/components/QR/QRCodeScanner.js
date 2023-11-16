import React, { useState } from "react";
import { useZxing } from "react-zxing";
import { useNavigate } from "react-router-dom";
import "./Qr.css";
import bgdot from "../Assets/bgdot.png";
import bgdot1 from "../Assets/bgdot1.png";
import VerifyGif from "../Assets/verify.gif"; // Import the verify.gif file

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
  ]);
  const [selectedDestination, setSelectedDestination] = useState("");

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
    fetchBuses(result, stop);
  };

  const fetchBuses = (currentLocation, selectedDestination) => {
    fetch("/api/track-buses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentLocation,
        selectedDestination,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Buses:", data);
      })
      .catch((error) => {
        console.error("Error fetching buses:", error);
      });
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      const scannedText = result.getText();
      setResult(scannedText);

      if (isValidURL(scannedText)) {
        alert(`Scanned: ${scannedText}. Please scan the correct QR code`);
      } else {
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
        // Display VerifyGif instead of video when QR is scanned
        <div className="verify-container">
          <img src={VerifyGif} alt="Verify" className="verify-gif" />
        </div>
      ) : (
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
                <a key={index} onClick={() => handleDestinationSelect(stop)}>
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