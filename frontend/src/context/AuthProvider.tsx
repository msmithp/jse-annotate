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

interface ContextType {
    user: User | null,
    authTokens: AuthTokens | null,
    loginUser: (username: string, password: string) => Promise<void>,
    logoutUser: () => void 
}

interface AuthTokens {
    access: string,
    refresh: string
}

const AuthContext = createContext<ContextType | undefined>(undefined);

interface AuthProviderProps {
    children?: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);

    const navigate = useNavigate();

    async function loginUser(username: string, password: string) {
        console.log("Logging in user " + username + " with password " + password);

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
            const id = jwtDecode<CustomJwtPayload>(res.data.access).user_id;
            setAuthTokens({
                access: res.data.access,
                refresh: res.data.refresh
            });
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);

            axios.get("http://127.0.0.1:8000/api/get-user/", {params: {id: id}})
            .then(res => {
                console.log(res.data);
                setUser(res.data);
            }).catch(err => console.log(err));

            navigate("/");
        }).catch(err => console.log(err));
    }

    function logoutUser() {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        setAuthTokens(null);
        setUser(null);
        navigate("/login");
    }

    const contextData = {
        user: user,
        authTokens: authTokens,
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
