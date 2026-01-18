import { logout } from "../../api/userApi.js";
import "../chat/chat.css";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate("/login");
        } catch (err) {
            console.log(error);
        }
    }

    return (
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
    )
}
