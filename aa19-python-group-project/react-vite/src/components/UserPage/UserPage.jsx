import MapComponent from '../MapComponent/MapComponent';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navigation from "../Navigation/Navigation";
import "./UserPage.css";

function UserPage() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [categories, setCategories] = useState([]);
//   const [locations, setLocations] = useState([]);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    fetch(`/api/help_requests/`)
      .then((response) => response.json())
      .then((data) => {
        setHelpRequests(data.HelpRequests || []);
      });
  }, []);

  useEffect(() => {
    fetch(`/api/categories/`)
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.categories || []);
      });
  }, []); 

//   useEffect(() => {
//     fetch(`/api/locations/`)
//       .then((response) => response.json())
//       .then((data) => {
//         setLocations(data.locations || []);
//       });
//   }, []);

  return (
    <div className="user-page">
      <Navigation />
      <h2>Welcome, {user.username}</h2>
      <section>
        <h3>Your Help Requests</h3>
        <ul>
          {helpRequests.map((request) => (
            <li key={request.id}>
              <h4>{request.title}</h4>
              <p>{request.description}</p>
              {request.location && (
                <p>
                  <strong>Location:</strong> {request.location.name}, {request.location.address}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Your Map</h3>
        <MapComponent />
      </section>
      <section>
        <h3>Your Categories</h3>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default UserPage;