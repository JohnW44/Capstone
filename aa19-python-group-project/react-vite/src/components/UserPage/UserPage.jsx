import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchHelpRequests, updateHelpRequestStatus,  } from "../../redux/helpRequests";
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
    const { setModalContent, closeModal } = useModal();

    const handleCreateRequest = () => {
        setModalContent(
            <CreateHelpRequestModal
                onRequestCreated={() => {
                    closeModal();
                    dispatch(fetchHelpRequests());
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

    const handleEditRequest = (request) => {
        setModalContent(
            <CreateHelpRequestModal
                initialFormData={request}
                isEdit={true}
                requestId={request.id}
                onRequestCreated={() => {
                    closeModal();
                    dispatch(fetchHelpRequests());
                }}
            />
        );
    };

    const handleStatusUpdate = async (request) => {
        const newStatus = request.status === 'pending' ? 'completed' : 'pending';
        await dispatch(updateHelpRequestStatus(request.id, newStatus));
        dispatch(fetchHelpRequests());
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

    const pendingRequests = userHelpRequests.filter(request => !request.status || request.status === 'pending');
    const completedRequests = userHelpRequests.filter(request => request.status === 'completed');


    const handleCardClick = (request, e) => {
        if (e.target.closest('.button-group')) {
            return;
        }
        
        if (request.userId === user.id) {
            navigate(`/help_requests/${request.id}`);
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
            
            <div className="help-requests-container">
                <div className="pending-requests">
                    <h2>Your Active Help Requests</h2>
                    <div className="help-requests">
                        {pendingRequests.length > 0 ? (
                            pendingRequests.map(request => (
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
                                            className="details-btn"
                                            onClick={() => navigate(`/help_requests/${request.id}`)}
                                        >
                                            Details
                                        </button>
                                        <button 
                                            className="edit-btn"
                                            onClick={() => handleEditRequest(request)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="status-btn pending"
                                            onClick={() => handleStatusUpdate(request)}
                                        >
                                            Mark Complete
                                        </button>
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
                            <p>No active help requests.</p>
                        )}
                    </div>
                </div>

                <div className="completed-requests">
                    <h2>Completed Help Requests</h2>
                    <div className="help-requests">
                        {completedRequests.length > 0 ? (
                            completedRequests.map(request => (
                                <div 
                                    key={request.id} 
                                    className="help-request completed clickable"
                                    onClick={(e) => handleCardClick(request, e)}
                                >
                                    <div className="help-request-content">
                                        <h3>{request.title}</h3>
                                        <p>{request.description}</p>
                                    </div>
                                    <div className="button-group">
                                        <button 
                                            className="details-btn"
                                            onClick={() => navigate(`/help_requests/${request.id}`)}
                                        >
                                            Details
                                        </button>
                                        <button 
                                            className="status-btn completed"
                                            onClick={() => handleStatusUpdate(request)}
                                        >
                                            Mark Pending
                                        </button>
                                        <button 
                                            className="show-location-btn"
                                            onClick={() => setSelectedRequestId(request.id)}
                                        >
                                            Show Location
                                        </button>
                                        <button 
                                            className="review-btn"
                                            onClick={() => navigate(`/help_requests/${request.id}`)}
                                        >
                                             Leave Review
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No completed help requests.</p>
                        )}
                    </div>
                </div>
            </div>
            
            <h2 className="all-help-requests-title">All Help Requests</h2>
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

            <h2 className="all-requests-title">A Map</h2>
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