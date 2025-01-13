import MapComponent from '../MapComponent/MapComponent';
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchHelpRequests } from "../../redux/helpRequests";
import { fetchLocations } from "../../redux/locations";
import "./UserPage.css";

function UserPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const user = useSelector(state => state.session.user);
    const helpRequests = useSelector(state => {
        console.log("Full Redux State:", state);
        console.log("Help Requests from Redux:", state.helpRequests);
        return state.helpRequests;
    });
    const locations = useSelector(state => state.locations);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        console.log("Fetching help requests...");
        dispatch(fetchHelpRequests())
            .then(response => {
                console.log("Help Requests Response:", response);
            })
            .catch(error => {
                console.error("Error fetching help requests:", error);
            });
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchLocations());
    }, [dispatch]);

    const userHelpRequests = helpRequests.filter(request => {
        console.log("Comparing request.userId:", request.userId, "with user.id:", user?.id);
        return request.userId === user?.id;
    });

    console.log("Current User:", user);
    console.log("Filtered User Help Requests:", userHelpRequests);

    if (!user) return null;

    return (
        <div className="user-page">
            <h1>Welcome, {user.username}</h1>
            
            <h2>Your Help Requests</h2>
            <div className="help-requests">
                {userHelpRequests?.length > 0 ? (
                    userHelpRequests.map(request => (
                        <div key={request.id} className="help-request">
                            <h3>{request.title}</h3>
                            <p>{request.description}</p>
                            <button 
                                className="show-location-btn"
                                onClick={() => setSelectedRequestId(request.id)}
                            >
                                Show Location
                            </button>
                        </div>
                    ))
                ) : (
                    <p>You haven&apos;t created any help requests yet.</p>
                )}
            </div>
            
            <h2>All Help Requests</h2>
            <div className="all-help-requests">
                {helpRequests.map(request => (
                    <div key={request.id} className="help-request">
                        <h3>{request.title}</h3>
                        <p>Posted by: {request.username}</p>
                        <p>{request.description}</p>
                        <button 
                            className="show-location-btn"
                            onClick={() => setSelectedRequestId(request.id)}
                        >
                            Show Location
                        </button>
                    </div>
                ))}
            </div>

            <h2>Location Map</h2>
            <div className="map-container">
                <MapComponent 
                    helpRequests={helpRequests}
                    locations={locations}
                    selectedRequestId={selectedRequestId}
                />
            </div>
        </div>
    );
}

export default UserPage;