import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
// import Qr from "./components/QR/Qr";
import Scannow from "./components/Scannow/Scan";
import RequireAuth from "./components/RequireAuth";
import Missing from "./components/Missing";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import QRCodeScanner from "./components/QR/QRCodeScanner";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Scannow/>} />
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      {/* we want to protect these routes */}
      <Route element={<RequireAuth />}>
        {/* <Route path="/Qr" element={<Qr />} /> */}
        <Route path="/Qr" element={<QRCodeScanner />} />

      </Route>
      {/* catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}

export default App;
