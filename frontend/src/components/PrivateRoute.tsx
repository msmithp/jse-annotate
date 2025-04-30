/** PrivateRoute.tsx * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * The PrivateRoute component wraps around children components to "protect"
 * them from being accessed by non-authenticated users.
 */


import { Navigate } from "react-router-dom";
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
