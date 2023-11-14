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
  const handleScannedText = (scannedText) => {
    // Convert the scanned text to lowercase for case-insensitive comparison
    const scannedTextLower = scannedText.toLowerCase();
    console.log(result);
    // Check if the scanned text matches any of the bus stop text codes
    if (busStopTextCodes.hasOwnProperty(scannedTextLower)) {
      const busstop = busStopTextCodes[scannedTextLower];
      navigate(`/${busstop}`); // Navigating to a route with bus details based on the destination
    } else {
      alert(`Scanned code '${scannedText}' does not match any bus stop.`);
    }
  };
  const { ref } = useZxing({
    onDecodeResult(result) {
      const scannedText = result.getText();
      setResult(scannedText);
      
      handleScannedText(scannedText);
    },
  });
      

      {/*// Check if the scanned text is "Edappally"
      if (scannedText.toLowerCase() === "http://edapally") {
        navigate("/register");
        } 
         else if (scannedText.toLowerCase() === "http://thrikkakara") {
        navigate("/register");
         }
         else if (scannedText.toLowerCase() === "http://pipeline") {
        navigate("/register");
         }
         else if (scannedText.toLowerCase() === "http://ngo") {
        navigate("/register");
         }
         else if (scannedText.toLowerCase() === "http://cusat") {
        navigate("/register");
         }
        // else if (isValidURL(scannedText)) {
        // Redirect to the scanned URL if it's a valid URL
        // window.location.href = scannedText;
    //   } 
      else {
        // Handle other cases (non-URL, non-"Edappally") as needed
        alert(`Scanned: ${scannedText}.Please scan the correct QR code`);
      }*/}
   

  // Function to check if a given string is a valid URL
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
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

  return (
    <div className="background" style={backgroundStyle}>
      <div className="video-container">
        <video className="video" ref={ref} />
        <p>
          <span className="qr-text">Scan your QR!</span>
        </p>
      </div>
    </div>
  );
};

export default QRCodeScanner;
