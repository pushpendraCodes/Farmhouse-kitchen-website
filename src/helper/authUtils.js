const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
// const SESSION_DURATION = 30 * 1000; // 7 days in milliseconds

export const isSessionExpired = () => {
    const loginTime = localStorage.getItem("loginTime");
    if (!loginTime) return true;
    return Date.now() - parseInt(loginTime) > SESSION_DURATION;
};

export const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("loginTime");
};