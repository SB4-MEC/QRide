{
  /*This is not for getting new refresh token, 
 this is for getting new access token in case access token expires */
}

import axios from "../api/Axios";
import useAuth from "./useAuth";

const useNewAccessToken = () => {
  const { setAuth } = useAuth();

  const newaccess = async () => {
    {
      /*here we are just refreshing the access token so that in case when access token of
       user expires it is automatically renewed in the background and does not bother the user*/
    }

    const response = await axios.get("/refresh", {
      withCredentials: true,
    });
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);
      return { ...prev, accessToken: response.data.accessToken };
    });
    return response.data.accessToken;
  };
  return newaccess;
};

export default useNewAccessToken;
