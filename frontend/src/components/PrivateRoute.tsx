import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "src/context/AuthProvider";

interface PrivateRouteProps {
    children?: React.ReactElement
}

export default function PrivateRoute({ children, ...rest } : PrivateRouteProps) {
    const authData = useAuthContext();
    const user = authData.user;

    return (
        <>
            {!user ? <Navigate to="/login" /> : children}
        </>
    );
}
