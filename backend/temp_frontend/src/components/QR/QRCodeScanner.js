import { useState } from "react";
import { useZxing } from "react-zxing";
import { useNavigate } from "react-router-dom";
import "./Qr.css";
import bgdot from "../Assets/bgdot.png"; // Import the default background image
import bgdot1 from "../Assets/bgdot1.png"; // Import the alternative background image

export const BarcodeScanner = () => {
  const navigate = useNavigate();
  const navigateToHome = () => {
    navigate("/home");
  };
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
      // Redirect to the scanned URL (assuming it's a valid URL)
      if (isValidURL(result.getText())) {
        window.location.href = result.getText();
      }
    },
  });

  // Function to check if a given string is a valid URL
  const isValidURL = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Define the background image URL based on media query
  let backgroundImageUrl = `url(${bgdot})`; // Default background image

  if (window.innerWidth <= 425) {
    backgroundImageUrl = `url(${bgdot1})`; // Alternative background image for smaller screens
  }

  const backgroundStyle = {
    backgroundImage: backgroundImageUrl,
    backgroundSize: "cover",
    height: "100vh",
    display: "flex",
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

export default BarcodeScanner;
