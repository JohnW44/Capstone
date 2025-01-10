import { NavLink, useLocation } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  // Don't show navigation on landing page
  if (isLandingPage) {
    return null;
  }

  return (
    <ul>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
