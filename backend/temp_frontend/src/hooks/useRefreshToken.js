import { useContext } from 'react';
import axios from '../api/Axios';
import AuthContext from '../context/AuthProvider';
const NEW_ACCESS_TOKEN_URL = "/auth/jwt/refresh/";

const useRefreshToken = () => {
    const { setAuthTokens } = useContext(AuthContext);

    const refresh = async () => {
        const response = await axios.get(NEW_ACCESS_TOKEN_URL, {
            withCredentials: true
        });
        setAuthTokens(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.access);
            return { ...prev, accessToken: response.data.accessToken }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;