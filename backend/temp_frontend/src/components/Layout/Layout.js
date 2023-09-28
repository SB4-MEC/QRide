import React from 'react'
import { Outlet } from 'react-router-dom'
import qr_image from "../Assets/qr.png";

const Layout = () => {
  return (
    <div className="flex flex-col md:flex-row w-screen h-screen overflow-y-auto">
      <div className='flex w-full md:w-[55%] flex-shrink-0 h-full bg-green-200 flex-col justify-center items-center rounded-r-5xl'>
      <h1 className="font-poppins font-semibold md:font-bold text-6xl mb-20">QRide</h1>
        <img src={qr_image} alt="qr" className="mb-20 aspect-w-16 aspect-h-9" />
      </div>

      <div className='flex flex-col flex-shrink-0 w-full md:w-[45%] h-full'>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
