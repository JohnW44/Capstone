// import { useEffect, useState } from "react";
// import { useDispatch } 
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"
import { GoogleMap, Marker } from "@react-google-maps/api";
import './HelpRequestDetail.css'

function HelpRequestDetail() {
    const { requestId } = useParams();
    // const dispatch = useDispatch();
    const navigate = useNavigate();

    const helpRequest = useSelector(state =>
        state.helpRequests.find(req => req.id === parseInt(requestId))
    );
    const location = useSelector(state => 
        state.locations.find(loc => loc.id === helpRequest?.locationId)
    );
    if (!helpRequest) return <div>Help request not found</div>
    const containerStyle = {
        width: '100%',
        height: '300px'
    };

    return (
        <>
        <div className="help-request-detail-container">
            <div className="help-request-header">
                <h1>{helpRequest.title}</h1>
                <div className="status-badge">{helpRequest.status}</div>
            </div>

            <div className="help-request-content">
                <section className="description-section">
                    <h2>Description</h2>
                    <p>{helpRequest.description}</p>
                </section>

                <section className="locatioon-section">
                    <h2>Location</h2>
                    {location && (
                        <>
                            <p>{location.address}</p>
                            <div className="map-container">
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={{
                                        lat: Number(location.lat),
                                        lng: Number(location.lng)
                                    }}
                                    zoom={15}
                                >
                                    <Marker
                                        position={{
                                            lat: Number(location.lat),
                                            lng: Number(location.lng)
                                        }}
                                    />
                                </GoogleMap>
                            </div>
                        </>
                    )}
                </section>

                <section className="actions-section">
                    <button 
                        className="edit-button"
                        onClick={() => navigate(`/help-requests/${requestId}/edit`)}
                    >
                        Edit Request
                    </button>
                    <button 
                        className="delete-button"
                        onClick={() => {
                        }}
                    >
                        Delete Request
                    </button>
                </section>
            </div>
        </div>
        </>
    )
}

export default HelpRequestDetail;