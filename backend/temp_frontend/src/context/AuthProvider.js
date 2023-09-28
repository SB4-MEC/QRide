import { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const logout = () => {
        // Clear authentication data
        setAuth({
            accessToken: null,  // Clear the token
            user: null,   // Clear user information (if applicable)
            // Other fields you may have in the auth state
        });
    };

    return (
        <AuthContext.Provider value={{ auth, setAuth,logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;