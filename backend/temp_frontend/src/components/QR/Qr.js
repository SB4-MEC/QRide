import React from "react";
import Users from "../Users";
import Logout from "../Logout";

const Qr = () => {
  return (
    <div>
      Qr code scan page
      <br />
      User details
      {/* <br />
      <Users />
      <br /> */}
      <br />
      <button onClick={<Logout />}>Logout</button>
    </div>
  );
};

export default Qr;
