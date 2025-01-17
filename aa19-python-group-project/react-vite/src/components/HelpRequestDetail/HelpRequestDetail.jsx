import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"
import { GoogleMap, Marker } from "@react-google-maps/api";
import { useModal } from '../../context/Modal';
import ReviewFormModal from '../ReviewFormModal/ReviewFormModal';
import LocationChangeModal from "../LocationChangeModal/LocationChangeModal";
import CreateHelpRequestModal from '../CreateHelpRequestModal/CreateHelpRequestModal';
import { fetchHelpRequests } from "../../redux/helpRequests";
import './HelpRequestDetail.css'
import { fetchLocations } from "../../redux/locations";

function HelpRequestDetail() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [review, setReview] = useState(null);
    const [error, setError] = useState(null);
    const { setModalContent, closeModal } = useModal();
    const currentUser = useSelector(state => state.session.user);
    const dispatch = useDispatch();

    const helpRequest = useSelector(state =>
        state.helpRequests.find(req => req.id === parseInt(requestId))
    );
    const location = useSelector(state => 
        state.locations.find(loc => loc.id === helpRequest?.locationId)
    );

    useEffect(() => {
        if (requestId) {
            dispatch(fetchHelpRequests());
            dispatch(fetchLocations());
        }
    }, [dispatch, requestId]);

    useEffect(() => {
        if (requestId) {
            fetch(`/api/reviews/help_requests/${requestId}`)
                .then(response => {
                    if (!response.ok) {
                        if (response.status === 404) {
                            setReview(null);
                            return;
                        }
                        throw new Error('Failed to fetch review');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.review) {
                        setReview(data.review);
                    }
                })
                .catch(error => {
                    console.error('Error fetching review:', error);
                    setError(error.message);
                });
        }
    }, [requestId]);

    const handleDeleteReview = () => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            fetch(`/api/reviews/${review.id}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (response.ok) {
                        setReview(null);
                    }
                });
        }
    };

    const handleEditRequest = () => {
        setModalContent(
            <CreateHelpRequestModal
                initialFormData={{
                    ...helpRequest,
                    location: location
                }}
                isEdit={true}
                requestId={requestId}
                onRequestCreated={() => {
                    closeModal();
                    dispatch(fetchHelpRequests());
                    dispatch(fetchLocations());
                }}
            />
        );
    };

    const handleDeleteRequest = () => {
        if (window.confirm('Are you sure you want to delete this help request?')) {
            fetch(`/api/help_requests/${requestId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    navigate('/user');
                } else {
                    throw new Error('Failed to delete help request');
                }
            })
            .catch(error => {
                console.error('Error deleting help request:', error);
                setError(error.message);
            });
        }
    };

    const handleChangeLocation = () => {
        setModalContent(
            <LocationChangeModal
                helpRequestId={requestId}
                onLocationSelect={async () => {
                    await dispatch(fetchHelpRequests());
                    await dispatch(fetchLocations());
                    closeModal();
                }}
            />
        );
    };

    const handleReviewSubmit = (reviewData) => {
        setError(null);

        const method = review ? 'PUT' : 'POST';
        const url = review 
            ? `/api/reviews/${review.id}`
            : `/api/reviews/help_requests/${requestId}`;

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                rating: reviewData.rating,
                comment: reviewData.comment,
                ...(method === 'POST' && { volunteerId: currentUser.id })
            })
        })
            .then(response => {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json().then(data => {
                        if (!response.ok) {
                            throw new Error(data.message || 'Failed to submit review');
                        }
                        return data;
                    });
                } else {
                    return response.text().then(text => {
                        throw new Error('Server returned non-JSON response: ' + text);
                    });
                }
            })
            .then(data => {
                if (data.review) {
                    setReview(data.review);
                    closeModal();
                }
            })
            .catch(error => {
                console.error('Error submitting review:', error);
                setError(error.message);
            });
    };

    const handleReviewClick = () => {
        setModalContent(
            <ReviewFormModal
                helpRequestId={requestId}
                onReviewSubmit={handleReviewSubmit}
                initialReview={review}
            />
        );
    };

    if (!helpRequest) return <div>Help request not found</div>;

    const canManageReview = currentUser?.id === helpRequest.userId;
    const showReviewSection = helpRequest.status === 'completed';

    const containerStyle = {
        width: '100%',
        height: '300px'
    };

    const center = location ? {
        lat: Number(location.lat),
        lng: Number(location.lng)
    } : {
        lat: 37.7749,
        lng: -122.4194
    };

    return (
        <>
        <div className="help-request-detail-container">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <div className="help-request-header">
                <h1>{helpRequest.title}</h1>
                <div className="status-badge">{helpRequest.status}</div>
            </div>

            <div className="help-request-content">
                <section className="description-section">
                    <h2>Description</h2>
                    <p>{helpRequest.description}</p>
                </section>

                <section className="location-section">
                    <h2>Location</h2>
                    {location && (
                        <>
                            <p>{location.address}</p>
                            <div className="map-container">
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    zoom={15}
                                >
                                    <Marker
                                        key={location.id}
                                        position={center}
                                        title={location.address}
                                    />
                                </GoogleMap>
                            </div>
                        </>
                    )}
                </section>

                {showReviewSection && (
                    <section className="review-section">
                        <h2>Review</h2>
                        {review ? (
                            <div className="review-display">
                                <div className="rating">Rating: {review.rating}/5</div>
                                <p>{review.comment}</p>
                                {canManageReview && (
                                    <div className="review-actions">
                                        <button onClick={handleReviewClick}>
                                            Edit Review
                                        </button>
                                        <button onClick={handleDeleteReview}>
                                            Delete Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            canManageReview && (
                                <button 
                                    className="create-review-btn"
                                    onClick={handleReviewClick}
                                >
                                    Leave a Review
                                </button>
                            )
                        )}
                    </section>
                )}

                <section className="actions-section">
                    {canManageReview && helpRequest.status !== 'completed' && (
                        <>
                            <button 
                                className="edit-button"
                                onClick={handleEditRequest}
                            >
                                Edit Request
                            </button>
                            <button 
                                className="change-location-button"
                                onClick={handleChangeLocation}
                            >
                                Change Location
                            </button>
                            <button 
                                className="delete-button"
                                onClick={handleDeleteRequest}
                            >
                                Delete Request
                            </button>
                        </>
                    )}
                </section>
            </div>
        </div>
        </>
    )
}

export default HelpRequestDetail;