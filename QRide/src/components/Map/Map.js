import React, { useState, useEffect } from "react";
import { LoadScript, GoogleMap, InfoWindow } from "@react-google-maps/api";
import './Map.css';

import blueIconImg from '../Assets/blue-marker.png';
import busIconImg from '../Assets/bus.png';

const DEFAULT_LATITUDE = 10.0261;
const DEFAULT_LONGITUDE = 76.3125;
const key = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

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

  // Log to ensure the key is being read correctly
  useEffect(() => {
    console.log('Google Maps API Key:', key);
  }, [key]);

  useEffect(() => {
    if (window.google) {
      console.log("Google object exists"); // Debugging statement

      const resizedBlueIcon = {
        url: blueIconImg,
        scaledSize: new window.google.maps.Size(30, 30),
      };

      const resizedBusIcon = {
        url: busIconImg,
        scaledSize: new window.google.maps.Size(0, 40),
      };

      const initialMarkers = [
        { geocode: [9.92, 76.26], popUp: "PALLURUTHY", icon: resizedBusIcon },
        { geocode: [9.94, 76.27], popUp: "KATTUPARAMBU", icon: resizedBusIcon },
        { geocode: [9.95, 76.28], popUp: "THEVARA", icon: resizedBusIcon },
        { geocode: [9.97, 76.28], popUp: "KACHERIPADI", icon: resizedBusIcon },
        { geocode: [9.96, 76.27], popUp: "PALLIMUKKU", icon: resizedBusIcon },
        { geocode: [9.88, 76.27], popUp: "KUMBALANGI", icon: resizedBusIcon },
        { geocode: [9.94, 76.26], popUp: "THOPPUMPADY", icon: resizedBusIcon },
        { geocode: [10.05, 76.33], popUp: "CUSAT", icon: resizedBusIcon },
        { geocode: [10.02, 76.30], popUp: "EDAPPALLY", icon: resizedBusIcon },
        { geocode: [10.03, 76.32], popUp: "THRIKKAKARA", icon: resizedBusIcon },
        { geocode: [10.05, 76.30], popUp: "PIPELINE", icon: resizedBusIcon },
        { geocode: [10.01, 76.29], popUp: "NGO", icon: resizedBusIcon }
      ];

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            geocode: [position.coords.latitude, position.coords.longitude],
            popUp: "Your Location",
            // icon: resizedBlueIcon // Assign resizedBlueIcon here
          };
          setMarkers([...initialMarkers, userLocation]);
          console.log('User location fetched and markers set', [...initialMarkers, userLocation]); // Debugging statement
        },
        (error) => {
          console.error("Error getting user location: ", error);
          setMarkers(initialMarkers); // Set initial markers even if we fail to get user's location
          console.log('Initial markers set', initialMarkers); // Debugging statement
        }
      );
    } else {
      console.log("Google object not found"); // Debugging statement
    }
  }, []);

  const initMarkers = (google, map) => {
    markers.forEach(marker => {
      const position = new google.maps.LatLng(marker.geocode[0], marker.geocode[1]);
      console.log(`Creating marker at ${position}`); // Debugging statement
      
      const mapMarker = new google.maps.Marker({
        position: position,
        map: map,
        icon: marker.icon || { url: busIconImg, scaledSize: new google.maps.Size(30, 30) },
        title: marker.popUp
      });

      mapMarker.addListener("click", () => {
        setSelectedMarker(marker);
        console.log(`Marker clicked: ${marker.popUp}`); // Debugging statement
      });
    });
  };

  return (
    <div>
      {loadError && <div className="error">{`Error loading map: ${loadError.message}`}</div>}
      <LoadScript 
        googleMapsApiKey="AIzaSyCjJx8ykUK4Pk-FdagbyR1RhtYTv29-zEU"
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
          onLoad={(map) => {
            console.log('Map loaded:', map);
            if (window.google) {
              initMarkers(window.google, map);
            }
          }}
          onUnmount={(map) => console.log('Map unmounted:', map)}
        >
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
