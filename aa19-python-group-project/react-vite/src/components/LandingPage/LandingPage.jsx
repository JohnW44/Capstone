import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import "./LandingPage.css";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import logo from '../../../site-images/no-worries-logo.png';

function LandingPage() {
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const isAuthenticated = useSelector((state) => !!state.session.user);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user");
    }
  }, [isAuthenticated, navigate]);

  const handleHelperClick = () => {
    alert("Feature coming soon! Stay tuned!");
  };

  const handleLoginClick = () => {
    setModalContent(<LoginFormModal />);
  };

  const handleSignupClick = () => {
    setModalContent(<SignupFormModal />);
  };

  return (
    <div className="landing-container">
      <div className="header-section">
        <img src={logo} alt="No Worries Logo" className="header-logo" />
        <p className="tagline">
          A way for seniors to connect with the neighborhood for help
        </p>
      </div>

      <div className="main-buttons">
        <button 
          className="action-button need-help"
          onClick={handleSignupClick}
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
          onClick={handleLoginClick}
        >
          Log in here
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
