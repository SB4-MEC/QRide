import React, { useState, createContext, useContext } from "react";

const BusContext = createContext({});

export const BusProvider = ({ children }) => {
  const [buses, setBuses] = useState([{}]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");

  const value = {
    buses,
    setBuses,
    selectedDestination,
    setSelectedDestination,
    currentLocation,
    setCurrentLocation,
  };

  return <BusContext.Provider value={value}>{children}</BusContext.Provider>;
};

export const useBus = () => {
  return useContext(BusContext);
};
