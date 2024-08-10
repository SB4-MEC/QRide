import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
// Import React and useState, useEffect hooks
import React, { useState, useEffect } from "react";
import "./Map.css";

import blueIconImg from '../Assets/blue-marker.png';
import busIconImg from '../Assets/bus1.png';

const DEFAULT_LATITUDE = 10.0261;
const DEFAULT_LONGITUDE = 76.3125;

const markers = [
  { geocode: [10.0284, 76.3109], popUp: "Edapally Toll" },
  { geocode: [9.9358, 76.2756], popUp: "Palluruthy" },
  { geocode: [10.0500, 76.2500], popUp: "Kattupuram" },
  { geocode: [9.9394, 76.2881], popUp: "Thevara" },
  { geocode: [9.9877, 76.2891], popUp: "Kacheripadi" },
  { geocode: [9.9705, 76.2873], popUp: "Pallimukku" },
  { geocode: [9.8805, 76.2911], popUp: "Kumbalangi" },
  { geocode: [9.9326, 76.2656], popUp: "Thoppumpady" },
  { geocode: [10.0470, 76.3320], popUp: "CUSAT" },
  { geocode: [10.0157, 76.3094], popUp: "Edappally" },
  { geocode: [10.0281, 76.3271], popUp: "Thrikkakara" },
  { geocode: [10.0272, 76.3163], popUp: "Pipeline" },
  { geocode: [10.0157, 76.3051], popUp: "NGO Quarters" }
];

const busIcon = new L.Icon({
  iconUrl: busIconImg,
  iconSize: [140, 90],
  iconAnchor: [60, 41],
  popupAnchor: [1, -34]
});

const blueIcon = L.divIcon({
  className: 'custom-blue-icon',
  html: `<div class="marker-wrapper"><img src="${blueIconImg}" class="blue-marker-img"></div>`,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

// Helper function to find the nearest marker
const findNearestMarker = (currentLocation, markers) => {
  let minDistance = Number.MAX_VALUE;
  let nearestMarker = null;
  markers.forEach(marker => {
    const distance = Math.sqrt(
      Math.pow(marker.geocode[0] - currentLocation[0], 2) +
      Math.pow(marker.geocode[1] - currentLocation[1], 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestMarker = marker;
    }
  });

  return nearestMarker;
};

const RoutingMachine = ({ userLocation, end }) => {
  const map = useMap();
  const [routingControl, setRoutingControl] = useState(null);

  useEffect(() => {
    if (!map || !userLocation || !end) return;

    // Create a new routing control
    const control = L.Routing.control({
      waypoints: [L.latLng(userLocation[0], userLocation[1]), L.latLng(end.geocode[0], end.geocode[1])],
      lineOptions: {
        styles: [{ color: 'blue', weight: 4 }]
      },
      createMarker: () => null
    })
      .on('routesfound', (e) => {
        const routes = e.routes;
        console.log(routes);
      })
      .addTo(map);

    setRoutingControl(control);

    return () => {
      if (map && control) {
        try {
          map.removeControl(control);
        } catch (error) {
          console.warn("Ignored error while removing control:", error);
        }
      }
    };
  }, [map, userLocation, end]);

  return null;
};

const Map = () => {
  const [currentLocation, setCurrentLocation] = useState([DEFAULT_LATITUDE, DEFAULT_LONGITUDE]);
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setCurrentLocation([position.coords.latitude, position.coords.longitude]);
      setLocationLoaded(true);
    }, () => {
      console.error("Error getting user's location");
    });
  }, []);

  const nearestMarker = findNearestMarker(currentLocation, markers);

  return (
    <MapContainer center={currentLocation} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {locationLoaded && (
        <>
          <Marker position={currentLocation} icon={blueIcon}>
            <Popup>You are here</Popup>
          </Marker>
          <RoutingMachine userLocation={currentLocation} end={nearestMarker} />
        </>
      )}

      {markers.map((marker, index) => (
        <Marker key={index} position={marker.geocode} icon={busIcon}>
          <Popup>{marker.popUp}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
