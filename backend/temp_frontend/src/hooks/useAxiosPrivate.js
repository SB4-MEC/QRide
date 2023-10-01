import { axiosPrivate } from "../api/Axios";
import { useEffect } from "react";
import useRefreshToken from "./useNewAccessToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await newaccess();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;

{/*why is interceptors used here?
    interceptors are used to modify the request before it is sent to the server and the response before it reaches the client
    In this case, we are modifying the request by adding the accessToken to the headers
    In this case, we are modifying the response by checking if the response status is 403 and if it is, we are sending the request again with the new accessToken
    Note that we are using the interceptors in a useEffect hook because we want to use the latest accessToken
    We are using the refresh hook here because we want to refresh the accessToken if it is expired
    We are using the auth hook here because we want to use the latest accessToken

*/}