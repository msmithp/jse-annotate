import { createContext, useContext, useState } from "react";
import { User } from "../static/types";

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

interface ContextType {
    user: User | null,
    authTokens: string[] | null,
    loginUser: any, //() => void,
    logoutUser: any //() => void 
}

const AuthContext = createContext<ContextType | undefined>(undefined);

interface AuthProviderProps {
    children?: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(testUser);
    const [authTokens, setAuthTokens] = useState(null);

    async function loginUser(username: string, password: string) {
        console.log("Logging in");
    }

    function logoutUser() {
        console.log("Logging out");
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
