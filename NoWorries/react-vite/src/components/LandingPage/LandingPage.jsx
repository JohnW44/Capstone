import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import "./LandingPage.css";
import { useModal } from "../../context/Modal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import logo from '../../../site-images/no-worries-logo.png';
import needHelpImage from '../../../site-images/gardener.jpeg';
import wantHelpImage from '../../../site-images/coupleWalking.jpeg';
import defaultImage from '../../../site-images/beach.jpeg';
import loginImage from '../../../site-images/pexels-mart-production-7330165.jpg';
import yoga from '../../../site-images/yoga.jpg';
import garden from '../../../site-images/Garden2.jpg'

function LandingPage() {
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const isAuthenticated = useSelector((state) => !!state.session.user);
  
  const allImages = useMemo(() => [
    defaultImage,
    needHelpImage,
    wantHelpImage,
    loginImage,
    yoga,
    garden
  ], []);

  const [currentImage, setCurrentImage] = useState(defaultImage);
  const [nextImage, setNextImage] = useState(defaultImage);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/user");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const getRandomImage = (currentImage) => {
      const availableImages = allImages.filter(img => img !== currentImage);
      const randomIndex = Math.floor(Math.random() * availableImages.length);
      return availableImages[randomIndex];
    };

    const interval = setInterval(() => {
      const newImage = getRandomImage(nextImage);
      setNextImage(newImage);
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentImage(newImage);
        setIsTransitioning(false);
      }, 2000);
    }, 7000);

    return () => clearInterval(interval);
  }, [nextImage, allImages]);

  useEffect(() => {
    allImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [allImages]);

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

      <div className="feature-image-container">
        <img 
          src={currentImage}
          alt="Feature" 
          className="feature-image current"
        />
        <img 
          src={nextImage}
          alt="Feature" 
          className={`feature-image next ${isTransitioning ? 'fade-in' : ''}`}
        />
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
