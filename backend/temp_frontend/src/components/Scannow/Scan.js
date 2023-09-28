import React from "react";
import bus_image from "../Assets/bus.png";
import bus1_image from "../Assets/bus1.png";
import profile_image from "../Assets/profile.png";
import { useNavigate } from "react-router-dom";

const Scan = () => {
  const navigate = useNavigate();

  const navigateToQr = () => {
    navigate("/Qr");
  };

  return (
    <div className="bg-[#c9e9e1] min-h-screen flex flex-col items-center justify-around p-10">
      <header className="w-full h-full flex items-center">
        <div className="flex items-center">
        <h1 className="text-black text-4xl font-bold mt-[-6rem]">QRide</h1>


        </div>
      </header>
      <main className="flex flex-col items-center w-full">
        <div className="text text-center">
          <h2 className="text-5xl font-bold">Effortless Bus Travel</h2>
          <h3 className="text-5xl font-bold">Scan, Know, Go!</h3>
          <p className="text-xl">
            Streamline your bus journey with a single scan.
          </p>
        </div>
        <div className="busdiv w-full">
          <img
            className="max-w-90% object-cover mx-auto"
            src={bus1_image}
            width="600"
            height="300"
            alt="Bus"
          />
        </div>
        <button
          className="scan-button bg-black text-white rounded-full py-2 px-4 text-2xl cursor-pointer transition duration-300 hover:bg-gray-700"
          onClick={navigateToQr}
        >
          Scan now
        </button>
      </main>
    </div>
  );
};

export default Scan;