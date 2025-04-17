import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";


interface CustomJwtPayload {
    exp: number;
    iat: number;
    jti: string;
    token_type: string;
    user_id: number;
    username: string;
  }

interface AuthContextType {
    user: CustomJwtPayload | null,
    loginUser: (username: string, password: string) => Promise<boolean>,
    logoutUser: () => void 
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children?: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    // Store user as a decoded JWT access token
    const [user, setUser] = useState<CustomJwtPayload | null>(
        localStorage.getItem("access") ? 
            jwtDecode<CustomJwtPayload>(localStorage.getItem("access")!)
            : null
    );

    const navigate = useNavigate();

    async function loginUser(username: string, password: string): Promise<boolean> {
        let successful = false;

        // Authenticate user in back-end
        await axios.post("http://127.0.0.1:8000/token/", 
            {
                username: username,
                password: password
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).then(res => {
            // Set JWT access and refresh tokens
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);

            setUser(jwtDecode<CustomJwtPayload>(res.data.access));

            // Redirect user to home page
            navigate("/");

            // Login was successful
            successful = true
        }).catch(err => {return err});

        // Return login status
        return successful;
    }

    function logoutUser() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setUser(null);
        navigate("/login");
    }

    const contextData = {
        user: user,
        loginUser: loginUser,
        logoutUser: logoutUser
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthContextProvider");
    }

    return context
}
