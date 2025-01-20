import { NavLink, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  if (isLandingPage) {
    return null;
  }

  return (
    <nav className="navigation-container">
      <ul className="nav-list">
        <div className="left-nav">
          <li>
            <NavLink to="/user" className="logo-link">
              <img 
                src="../../../site-images/no-worries-logo-nav.png" 
                alt="Logo" 
                className="nav-logo"
              />
            </NavLink>
          </li>
          <li>
            <NavLink to="/user" className="nav-link">Home</NavLink>
          </li>
        </div>
        <div className="right-nav">
          <li>
            <ProfileButton />
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Navigation;
