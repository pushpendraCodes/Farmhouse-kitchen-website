import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isSessionExpired, clearSession } from "./authUtils";

const useAutoLogout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkSession = () => {
            if (isSessionExpired()) {
                clearSession();
                // navigate("/login");
            }
        };

 
        checkSession();

     
    }, [navigate]);
};

export default useAutoLogout;