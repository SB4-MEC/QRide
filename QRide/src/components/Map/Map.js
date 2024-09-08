import React, { useState, useEffect } from "react";
import { LoadScript, GoogleMap, Marker, InfoWindow } from "@react-google-maps/api"; 
import './Map.css';

import busIconImg from '../Assets/bus.png';  // Note: Removed blueIconImg

const DEFAULT_LATITUDE = 10.0261;
const DEFAULT_LONGITUDE = 76.3125;
const containerStyle = {
  width: '100%',
  height: '100vh'
};

const center = {
  lat: DEFAULT_LATITUDE,
  lng: DEFAULT_LONGITUDE
};

const Map = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const key = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const initialMarkers = [
      { geocode: [9.92, 76.26], popUp: "PALLURUTHY", icon: busIconImg },
      { geocode: [9.94, 76.27], popUp: "KATTUPARAMBU", icon: busIconImg },
      { geocode: [9.95, 76.28], popUp: "THEVARA", icon: busIconImg },
      { geocode: [9.97, 76.28], popUp: "KACHERIPADI", icon: busIconImg },
      { geocode: [9.96, 76.27], popUp: "PALLIMUKKU", icon: busIconImg },
      { geocode: [9.88, 76.27], popUp: "KUMBALANGI", icon: busIconImg },
      { geocode: [9.94, 76.26], popUp: "THOPPUMPADY", icon: busIconImg },
      { geocode: [10.05, 76.33], popUp: "CUSAT", icon: busIconImg },
      { geocode: [10.02, 76.30], popUp: "EDAPPALLY", icon: busIconImg },
      { geocode: [10.03, 76.32], popUp: "THRIKKAKARA", icon: busIconImg },
      { geocode: [10.05, 76.30], popUp: "PIPELINE", icon: busIconImg },
      { geocode: [10.01, 76.29], popUp: "NGO", icon: busIconImg }
    ];

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          geocode: [position.coords.latitude, position.coords.longitude],
          popUp: "Your Location",
        };
        setMarkers([...initialMarkers, userLocation]);
      },
      (error) => {
        setMarkers(initialMarkers); // Set initial markers even if we fail to get user's location
      }
    );
  }, []);

  return (
    <div>
      {loadError && <div className="error">{`Error loading map: ${loadError.message}`}</div>}
      <LoadScript
        googleMapsApiKey={key}
        onLoad={() => console.log('Script loaded')}
        onError={(error) => {
          setLoadError(error);
          console.error('Error loading script:', error);
        }}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.geocode[0], lng: marker.geocode[1] }}
              icon={
                marker.popUp === "Your Location"
                  ? null // Use default Google Maps marker for user's location
                  : {
                      url: marker.icon,
                      scaledSize: new window.google.maps.Size(30, 30)
                    }
              }
              onClick={() => setSelectedMarker(marker)}
            />
          ))}

          {selectedMarker && (
            <InfoWindow
              position={{ lat: selectedMarker.geocode[0], lng: selectedMarker.geocode[1] }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div>
                <h2>{selectedMarker.popUp}</h2>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
