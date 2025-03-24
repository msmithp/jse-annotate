import { createContext, useContext, useState } from "react";
import { User } from "../static/types";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const testUser: User = {
    id: 0,
    username: "Guy",
    state: 3,
    education: "high_school",
    yearsExperience: 5,
    skills: [
        {id: 3, name: "Python"},
        {id: 5, name: "JavaScript"},
    ]
}

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
    // authTokens: AuthTokens | null,
    loginUser: (username: string, password: string) => Promise<void>,
    logoutUser: () => void 
}

interface AuthTokens {
    access: string,
    refresh: string
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

    // Store access and refresh tokens
    // const [authTokens, setAuthTokens] = useState<AuthTokens | null>(
    //     localStorage.getItem("access") && localStorage.getItem("refresh") ?
    //         { 
    //             access: localStorage.getItem("access")!, 
    //             refresh: localStorage.getItem("refresh")!
    //         }
    //         : null
    // );

    const navigate = useNavigate();

    async function loginUser(username: string, password: string) {
        console.log("Logging in user " + username + " with password " + password);

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
            // setAuthTokens({
            //     access: res.data.access,
            //     refresh: res.data.refresh
            // });
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);

            setUser(jwtDecode<CustomJwtPayload>(res.data.access));

            // Redirect user to home page
            navigate("/");
        }).catch(err => console.log(err));
    }

    function logoutUser() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        // setAuthTokens(null);
        setUser(null);
        navigate("/login");
    }

    // async function updateToken() {
    //     console.log("Updating access and refresh tokens...");

    //     await axios.post("http://127.0.0.1:8000/token/refresh/",
    //         {
    //             refresh: authTokens?.refresh
    //         },
    //         {
    //             headers: {
    //                 "Content-Type": "application/json"
    //             }
    //         }
    //     ).then(res => {
    //         if (res.status === 200) {
    //             // setAuthTokens({
    //             //     access: res.data.access,
    //             //     refresh: res.data.refresh
    //             // })
    //             localStorage.setItem("access", res.data.access);
    //             localStorage.setItem("refresh", res.data.refresh);
    
    //             setUser(jwtDecode<CustomJwtPayload>(res.data.access));
    //         } else {
    //             logoutUser();
    //         }
    //     }).catch(err => console.log(err));
    // }

    const contextData = {
        user: user,
        // authTokens: authTokens,
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
