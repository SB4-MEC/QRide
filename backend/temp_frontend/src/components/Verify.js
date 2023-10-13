import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { uid, access_token } = useParams();

  const verifyEmail = async () => {
    try {
      const response = await axios.get(
        VERIFY_URL,
        {
          uid,
          token: access_token,
        },

        {
          headers: {
            "Content-Type": "application/json",
            withCredentials: true,
          },
        }
      );

      // Handle a successful verification response
      console.log("Email verified:", response.data);
    } catch (error) {
      // Handle any errors that may occur during verification
      console.error("Email verification failed:", error);
    }
  };

  // Call the verification function immediately when the component renders
  verifyEmail();

  return (
    <div>
      <h2>Verifying Email...</h2>
      {/* You can add loading indicators or messages here while the verification process is ongoing */}
    </div>
  );
};

export default VerifyEmail;
