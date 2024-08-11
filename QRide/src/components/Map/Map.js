import React, { useState, useEffect } from "react";
import { LoadScript, GoogleMap, InfoWindow } from "@react-google-maps/api";
import './Map.css';

import blueIconImg from '../Assets/blue-marker.png';
import busIconImg from '../Assets/bus.png';

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

  useEffect(() => {
    if (window.google) {
      const resizedBlueIcon = {
        url: blueIconImg,
        scaledSize: new window.google.maps.Size(30, 30),
      };

      const resizedBusIcon = {
        url: busIconImg,
        scaledSize: new window.google.maps.Size(30, 40),
      };

      const initialMarkers = [
        { geocode: [9.92, 76.26], popUp: "PALLURUTHY" },
        { geocode: [9.94, 76.27], popUp: "KATTUPARAMBU" },
        { geocode: [9.95, 76.28], popUp: "THEVARA" },
        { geocode: [9.97, 76.28], popUp: "KACHERIPADI" },
        { geocode: [9.96, 76.27], popUp: "PALLIMUKKU" },
        { geocode: [9.88, 76.27], popUp: "KUMBALANGI" },
        { geocode: [9.94, 76.26], popUp: "THOPPUMPADY" },
        { geocode: [10.05, 76.33], popUp: "CUSAT" },
        { geocode: [10.02, 76.30], popUp: "EDAPPALLY" },
        { geocode: [10.03, 76.32], popUp: "THRIKKAKARA" },
        { geocode: [10.05, 76.30], popUp: "PIPELINE" },
        { geocode: [10.01, 76.29], popUp: "NGO" }
      ];

      // Fetch user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            geocode: [position.coords.latitude, position.coords.longitude],
            popUp: "Your Location",

          };
          setMarkers([...initialMarkers, userLocation]);
        },
        (error) => {
          console.error("Error getting user location: ", error);
          setMarkers(initialMarkers); // Set initial markers even if we fail to get user's location
        }
      );
    }
  }, []);

  const initMarkers = (google, map) => {
    markers.forEach(marker => {
      const position = new google.maps.LatLng(marker.geocode[0], marker.geocode[1]);

      const mapMarker = new google.maps.Marker({
        position: position,
        map: map,
        icon: marker.icon || { url: busIconImg, scaledSize: new google.maps.Size(30, 30) },
        title: marker.popUp
      });

      mapMarker.addListener("click", () => {
        setSelectedMarker(marker);
      });
    });
  };

  return (
    <div>
      {loadError && <div className="error">{`Error loading map: ${loadError.message}`}</div>}
      <LoadScript 
        googleMapsApiKey=""
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
