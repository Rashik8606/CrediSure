export const getUserRole = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role;
    } catch {
        return null;
    }
};

export default getUserRole