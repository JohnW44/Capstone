import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const handleHelperClick = () => {
    alert("Feature coming soon! Stay tuned!");
  };

  return (
    <div className="landing-container">
      <div className="header-section">
        <h1>No Worries</h1>
        <p className="tagline">
          A way for seniors to connect with the neighborhood for help
        </p>
      </div>

      <div className="main-buttons">
        <button 
          className="action-button need-help"
          onClick={() => navigate("/signup")}
        >
          I need help
        </button>

        <button 
          className="action-button want-help"
          onClick={handleHelperClick}
        >
          I want to help
        </button>
      </div>

      <div className="login-section">
        <p>Already a user?</p>
        <button 
          className="action-button login"
          onClick={() => navigate("/login")}
        >
          Log in here
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
