import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchHelpRequests, updateHelpRequestLocation } from "../../redux/helpRequests";
import { createLocation, fetchLocations } from "../../redux/locations";
import { useModal } from '../../context/Modal';
import LocationChangeModal from '../LocationChangeModal/LocationChangeModal';
import MapComponent from '../MapComponent/MapComponent';
import "./UserPage.css";

function UserPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const user = useSelector(state => state.session.user);
    const helpRequests = useSelector(state => state.helpRequests);
    const locations = useSelector(state => state.locations);
    const { setModalContent } = useModal();

    const handleLocationConfirm = async (locationData, helpRequestId) => {
        try {
            const response = await fetch('/api/locations/', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(locationData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to create location: ${errorData.message || 'Unknown error'}`);
            }

            const { location } = await response.json();
            dispatch(createLocation(location));
            
            const updateResponse = await fetch(`/api/help_requests/${helpRequestId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    locationId: location.id
                })
            });
            
            if (!updateResponse.ok) {
                const errorData = await updateResponse.json();
                throw new Error(`Failed to update help request: ${errorData.message || 'Unknown error'}`);
            }

            const updatedRequest = await updateResponse.json();
            dispatch(updateHelpRequestLocation(updatedRequest.HelpRequest));
            
            dispatch(fetchHelpRequests());
            dispatch(fetchLocations());
            
        } catch (error) {
            console.error('Error updating location:', error);
        }
    };

    const handleChangeLocation = (request) => {
        setModalContent(
            <LocationChangeModal 
                onLocationSelect={(newLocation) => handleLocationConfirm(newLocation, request.id)}
            />
        );
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        dispatch(fetchHelpRequests());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchLocations());
    }, [dispatch]);

    const userHelpRequests = helpRequests.filter(request => 
        request.userId === user?.id
    );

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
                            <div className="button-group">
                                <button 
                                    className="show-location-btn"
                                    onClick={() => setSelectedRequestId(request.id)}
                                >
                                    Show Location
                                </button>
                                <button 
                                    className="change-location-btn"
                                    onClick={() => handleChangeLocation(request)}
                                >
                                    Change Location
                                </button>
                            </div>
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