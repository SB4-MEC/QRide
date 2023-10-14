import React, { useContext } from 'react';
import AuthContext from '../context/AuthProvider';

const Logout = () => {
    const { removeCookie, setAuthTokens } = useContext(AuthContext);

    const handleLogout = () => {
        removeCookie('authTokens');
        setAuthTokens({});
    };

    return (
        <div>
            <p>Logout</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Logout;
