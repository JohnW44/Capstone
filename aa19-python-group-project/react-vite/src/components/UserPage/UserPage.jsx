import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchHelpRequests } from "../../redux/helpRequests";
import { fetchLocations } from "../../redux/locations";
import { useModal } from '../../context/Modal';
import CreateHelpRequestModal from '../CreateHelpRequestModal/CreateHelpRequestModal'
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

    const handleCreateRequest = () => {
        setModalContent(
            <CreateHelpRequestModal
                onRequestCreated={(newRequest) => {
                    navigate(`/help_requests/${newRequest.id}`);
                }}
            />
        );
    };

    const handleChangeLocation = (request) => {
        setModalContent(
            <LocationChangeModal 
                helpRequestId={request.id}
                onLocationSelect={() => {
                    setSelectedRequestId(request.id);
                }}
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

    const handleCardClick = (request, e) => {
        if (e.target.closest('.button-group')) {
            return;
        }
        
        if (request.userId === user.id) {
            navigate(`/help-requests/${request.id}`);
        }
    };

    if (!user) return null;

    return (
        <div className="user-page">
            <div className="page-header">
                <h1>Welcome, {user.username}</h1>
                <button 
                    className="create-request-btn"
                    onClick={handleCreateRequest}
                >
                    Create Help Request
                </button>
            </div>
            <h1>Welcome, {user.username}</h1>
            
            <h2>Your Help Requests</h2>
            <div className="help-requests">
                {userHelpRequests?.length > 0 ? (
                    userHelpRequests.map(request => (
                        <div 
                            key={request.id} 
                            className="help-request clickable"
                            onClick={(e) => handleCardClick(request, e)}
                        >
                            <div className="help-request-content">
                                <h3>{request.title}</h3>
                                <p>{request.description}</p>
                            </div>
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