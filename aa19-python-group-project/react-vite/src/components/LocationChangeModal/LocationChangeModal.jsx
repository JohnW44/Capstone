import { useState, useCallback } from 'react';
import { GoogleMap, Marker, StandaloneSearchBox } from '@react-google-maps/api';
import { useSelector, useDispatch } from 'react-redux';
import { createLocation, deleteLocation } from '../../redux/locations';
import { useModal } from '../../context/Modal';
import './LocationChangeModal.css'

function LocationChangeModal({ onLocationSelect }) {
    const [marker, setMarker] = useState(null);
    const [searchBox, setSearchBox] = useState(null);
    const [showSavedLocations, setShowSavedLocations] = useState(false);
    const { closeModal } = useModal();

    const user = useSelector(state => state.session.user);
    const locations = useSelector(state => state.locations);
    const helpRequests = useSelector(state => state.helpRequests);

    const userLocations = locations.filter(location =>
        location.userId === user?.id
    )
    
    const containerStyle = {
        width: '100%',
        height: '400px'
    };

    const defaultCenter = {
        lat: 32.7157,
        lng: -117.1611
    };

    const onMapClick = useCallback((e) => {
        const newLocation = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
            address: 'Custom Location',
            name: 'Selected Location',
            location_type: 'custom'
        };
        setMarker(newLocation);
    }, []);

    const onPlacesChanged = () => {
        if (searchBox) {
            const places = searchBox.getPlaces();
            if (places.length === 0) return;

            const place = places[0];
            const newLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address,
                name: place.name,
                location_type: 'searched'
            };
            
            setMarker(newLocation);
        }
    };

    const handleDeleteLocation = async (locationId) => {
        const isLocationInUse = helpRequests.some(request =>
            request.locationId === locationId
        );
        if (isLocationInUse) {
            alert("Cannot delete location that is being used by help requests");
            return;
        }
        await dispatch(deleteLocation(locationid));
    };

    const handleSelectSavedLocation = (location) => {
        setMarker({
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lng),
            address: location.name,
            location_type: location.location_type
        });
        setShowSavedLocations(false);
    }

    const handleConfirm = async () => {
        if (marker) {
            const locationData ={
                name: marker.name || 'Custom Location',
                address: marker.address,
                lat: marker.lat.toString(),
                lng: marker.lng.toString(),
                location_type: marker.location_type || 'custom'
            };

            const newLocation = await dispatch(createLocation(locationData));
            if (newLocation){

                onLocationSelect(marker);
                closeModal();
            }
        }
    };

    return (
        <div className='location-change-container'>
            <h2>Change Location</h2>

            <div className='location-options'>
                <button
                    className={`option-btn ${!showSavedLocations ? 'active' : ''}`}
                    onClick={() => setShowSavedLocations(false)}
                >
                    Search New Location
                </button>
                <button
                    className={`option-btn ${showSavedLocations ? 'active' : ''}`}
                    onClick={() => setShowSavedLocations(true)}
                >
                    Saved Locations ({userLocations.length})
                </button>
            </div>

            {showSavedLocations ? (
                <div className='saved-locations-list'>
                    {userLocations.length > 0 ? (
                        userLocations.map(location => (
                            <div key={location.id} className='saved-location-item'>
                                <div className='location-info'>
                                    <h4>{location.name}</h4>
                                    <p>{location.address}</p>
                                </div>
                                <div className='location-actions'>
                                    <button 
                                        className='select-btn'
                                        onClick={() => handleSelectSavedLocation(location)}
                                    >
                                        Select
                                    </button>
                                    <button 
                                        className='delete-btn'
                                        onClick={() => handleDeleteLocation(location.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='no-locations'>No saved locations yet</p>
                    )}
                </div>
            ) : (
                <>
                    <div className='search-box-container'>
                        <StandaloneSearchBox
                            onLoad={box => setSearchBox(box)}
                            onPlacesChanged={onPlacesChanged}
                        >
                            <input
                                type="text"
                                placeholder="Search for a location"
                                className='location-search-input'
                            />
                        </StandaloneSearchBox>
                    </div>

                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={defaultCenter}
                        zoom={12}
                        onClick={onMapClick}
                    >
                        {marker && (
                            <Marker position={{ lat: marker.lat, lng: marker.lng }} />
                        )}
                    </GoogleMap>
                </>
            )}

            <div className='modal-buttons'>
                <button className='cancel-btn' onClick={closeModal}>Cancel</button>
                <button
                    className='confirm-btn'
                    onClick={handleConfirm}
                    disabled={!marker}
                >
                    Confirm Location
                </button>
            </div>
        </div>
    );
}

export default LocationChangeModal;