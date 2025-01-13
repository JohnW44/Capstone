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
        <li>
          <NavLink to="/user" className="nav-link">Home</NavLink>
        </li>
        <li>
          <ProfileButton />
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
