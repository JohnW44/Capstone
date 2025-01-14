import { useState, useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useModal } from '../../context/Modal';
import './LocationChangeModal.css'

function LocationChangeModal({ onLocationSelect }) {
    const [marker, setMarker] = useState(null);
    const [searchBox, setSearchBox] = useState(null);
    const { closeModal } = useModal();

    const containerStyle = {
        width: '100%',
        height: '400px'
    };

    const defaultCenter = {
        lat: 32.7157,
        lng: -117.1611
    };

    const onMapClick = useCallback((e) => {
        console.log('Map clicked at:', e.latLng.toJSON());
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
            console.log('Selected place:', place);
            const newLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
                address: place.formatted_address,
                name: place.name,
                location_type: 'custom'
            };
            
            setMarker(newLocation);
        }
    };

    const handleConfirm = () => {
        if (marker) {
            console.log('Confirming location:', marker);
            onLocationSelect(marker);
            closeModal();
        }
    };

    return (
        <div className='location-change-container'>
            <h2>Change Location</h2>
            <p>Search for a location or click on the map to drop a pin</p>

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
                    <Marker
                        position={{ lat: marker.lat, lng: marker.lng }}
                    />
                )}
            </GoogleMap>

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
    )
}

export default LocationChangeModal;