import { Link } from "react-router-dom";
import "./home.css";

export default function Home() {
    return (
        <div className="home-container">
            <div className="home-content">
                <h1>Welcome To <span>ChatterAI</span></h1>
                <p style={{ color: "white" }}>Your intelligent conversation partner</p>
                <div className="home-links">
                    <Link to="/chat" className="signup-btn">Get Started <i class="fa-solid fa-arrow-right"></i> </Link>
                </div>
            </div>
        </div>
    );
}
