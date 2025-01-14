import { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import './MapComponent.css';

function MapComponent({ helpRequests, locations, selectedRequestId }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  const containerStyle = {
    width: '100%',
    height: '400px'
  };

  const defaultCenter = {
    lat: 32.7157,
    lng: -117.1611
  };

  const requestLocations = useMemo(() => {
    const uniqueLocations = new Map();
    
    helpRequests.forEach(request => {
      const location = locations.find(loc => loc.id === request.locationId);
      if (location && location.lat && location.lng) {
        const lat = parseFloat(location.lat);
        const lng = parseFloat(location.lng);
        
        if (!isNaN(lat) && !isNaN(lng)) {
          uniqueLocations.set(location.id, {
            ...location,
            lat,
            lng,
            requestId: request.id
          });
        }
      }
    });

    return Array.from(uniqueLocations.values());
  }, [helpRequests, locations]);

  useEffect(() => {
    if (selectedRequestId && mapRef) {
      const request = helpRequests.find(r => r.id === selectedRequestId);
      if (request) {
        const location = locations.find(loc => loc.id === request.locationId);
        if (location && location.lat && location.lng) {
          const lat = parseFloat(location.lat);
          const lng = parseFloat(location.lng);
          
          if (!isNaN(lat) && !isNaN(lng)) {
            mapRef.panTo({ lat, lng });
            setSelectedLocation(request);
          }
        }
      }
    }
  }, [selectedRequestId, helpRequests, locations, mapRef]);

  const handleMarkerClick = useCallback((location) => {
    const request = helpRequests.find(req => req.locationId === location.id);
    if (request) {
      setSelectedLocation(request);
    }
  }, [helpRequests]);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      zoom={12}
      onLoad={setMapRef}
    >
      {requestLocations.map(location => {
        return (
          <Marker
            key={`${location.id}-${location.requestId}`}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => handleMarkerClick(location)}
          />
        );
      })}

      {selectedLocation && (
        <InfoWindow
          position={{
            lat: parseFloat(locations.find(loc => loc.id === selectedLocation.locationId).lat),
            lng: parseFloat(locations.find(loc => loc.id === selectedLocation.locationId).lng)
          }}
          onCloseClick={() => setSelectedLocation(null)}
        >
          <div className="info-window">
            <h3>{selectedLocation.title}</h3>
            <p className="description">{selectedLocation.description}</p>
            <p className="location-name">
              Location: {locations.find(loc => loc.id === selectedLocation.locationId)?.name}
            </p>
            <p className="posted-by">Posted by: {selectedLocation.username}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default MapComponent;