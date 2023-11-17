import React from "react";
import bus1_image from "../Assets/bus1.png";
import { useNavigate } from "react-router-dom";

const Scan = () => {
  const navigate = useNavigate();

  const navigateToQr = () => {
    navigate("/QR");
  };

  return (
    <div className="bg-green-200 min-h-screen flex flex-col items-center justify-around pl-0 pt-10">
      <header className="w-full h-full flex items-center">
        <div className="flex items-center">
        <h1 className="text-black text-4xl font-bold mt-[-6rem] pt-10 pl-10">QRide</h1>
        </div>
      </header>
      <main className="flex flex-col items-center w-full ">
        <div className="text text-center">
          <h2 className="text-6xl font-bold ">Effortless Bus Travel</h2>
          <h3 className="text-6xl font-bold">Scan, Know, Go!</h3>
          <p className="text-2xl mb-20">
            Streamline your bus journey with a single scan.
          </p>
        </div>
        <div className="busdiv w-full mb-20">
          <img
            className="max-w-100% object-cover mx-auto "
            src={bus1_image}
            width="700"
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
