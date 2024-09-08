import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import  {AuthProvider}  from "./context/AuthProvider";
import { BusProvider } from "./context/BusProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthListener from "./components/AuthListener";
import { BookingProvider } from './context/BookingContext';
import { CountdownProvider } from "./context/CountdownContext";



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BusProvider>
      <BookingProvider> 
      <CountdownProvider>
      <AuthListener />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
      </CountdownProvider>
      </BookingProvider>
      </BusProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
