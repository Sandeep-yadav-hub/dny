import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
    const auth = useSelector(state=>state.auth);
    const location = useLocation();
    useEffect(()=>{
        console.log({allowedRoles})

    },[])
    return (
        auth?.user?.roles?.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : auth?.user
                ? <Navigate to="/unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;