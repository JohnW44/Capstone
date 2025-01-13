import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './MapComponent.css';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 32.7157,
  lng: -117.1611
};

function MapComponent({ helpRequests, locations, selectedRequestId }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;

  const getLocationDetails = useCallback((locationId) => {
    return locations.find(loc => loc.id === locationId);
  }, [locations]);

  useEffect(() => {
    if (selectedRequestId && mapRef) {
      const request = helpRequests.find(r => r.id === selectedRequestId);
      if (request) {
        const location = getLocationDetails(request.locationId);
        if (location && location.lat && location.lng) {
          try {
            const lat = parseFloat(location.lat);
            const lng = parseFloat(location.lng);
            
            if (!isNaN(lat) && !isNaN(lng)) {
              mapRef.panTo({ lat, lng });
              setSelectedLocation(request);

              const service = new window.google.maps.places.PlacesService(mapRef);
              service.nearbySearch({
                location: { lat, lng },
                radius: 50,  
                type: ['establishment']
              }, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results[0]) {
                  service.getDetails({
                    placeId: results[0].place_id,
                    fields: ['name', 'formatted_address', 'website', 'formatted_phone_number', 'opening_hours']
                  }, (place, detailStatus) => {
                    if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                      setPlaceDetails(place);
                    }
                  });
                }
              });
            }
          } catch (error) {
            console.error("Error parsing coordinates:", error);
          }
        }
      }
    }
  }, [selectedRequestId, helpRequests, mapRef, getLocationDetails]);

  const onLoad = map => {
    setMapRef(map);
  };

  return (
    <LoadScript 
      googleMapsApiKey={apiKey}
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
      >
        {helpRequests.map(request => {
          const location = getLocationDetails(request.locationId);
          if (!location || !location.lat || !location.lng) return null;

          try {
            const lat = parseFloat(location.lat);
            const lng = parseFloat(location.lng);
            
            if (isNaN(lat) || isNaN(lng)) return null;

            return (
              <Marker
                key={request.id}
                position={{ lat, lng }}
                onClick={() => setSelectedLocation(request)}
              />
            );
          } catch (error) {
            console.error("Error parsing coordinates for request:", request.id);
            return null;
          }
        })}

        {selectedLocation && (
          <InfoWindow
            position={{
              lat: parseFloat(getLocationDetails(selectedLocation.locationId).lat),
              lng: parseFloat(getLocationDetails(selectedLocation.locationId).lng)
            }}
            onCloseClick={() => {
              setSelectedLocation(null);
              setPlaceDetails(null);
            }}
          >
            <div className="info-window">
              <h3>{selectedLocation.title}</h3>
              <p className="description">{selectedLocation.description}</p>
              <p className="location-name">
                Location: {getLocationDetails(selectedLocation.locationId)?.name}
              </p>
              {placeDetails && (
                <div className="place-details">
                  <p className="place-name">{placeDetails.name}</p>
                  <p className="address">{placeDetails.formatted_address}</p>
                  {placeDetails.formatted_phone_number && (
                    <p className="phone">{placeDetails.formatted_phone_number}</p>
                  )}
                  {placeDetails.website && (
                    <a href={placeDetails.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  )}
                  {placeDetails.opening_hours && (
                    <p className="hours">
                      {placeDetails.opening_hours.isOpen() ? 'Open Now' : 'Closed'}
                    </p>
                  )}
                </div>
              )}
              <p className="posted-by">Posted by: {selectedLocation.username}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapComponent;