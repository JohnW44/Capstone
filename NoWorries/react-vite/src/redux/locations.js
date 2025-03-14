const LOAD_LOCATIONS = 'locations/LOAD';
const ADD_LOCATION = 'locations/ADD';
const REMOVE_LOCATION = 'locations/REMOVE';

const loadLocations = (locations) => ({
    type: LOAD_LOCATIONS,
    locations
})

const addLocation = (location) => ({
    type: ADD_LOCATION,
    location
})

const removeLocation = (locationId) => ({
    type: REMOVE_LOCATION,
    locationId
})

export const fetchLocations = () => async (dispatch) => {
    const response = await fetch('/api/locations/');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadLocations(data.locations));
    }
};

export const createLocation = (locationData) => async (dispatch) => {
    try {
        const response = await fetch('/api/locations/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(locationData)
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(addLocation(data.location));
            return data.location;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const deleteLocation = (locationId) => async (dispatch) => {
        const response = await fetch(`/api/locations/${locationId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });

    if (response.ok) {
        dispatch(removeLocation(locationId));
        return true;
    }
    return false;
};

const locationsReducer = (state = [], action) => {
    
    let nextState;
    
    switch (action.type) {
        case LOAD_LOCATIONS:
            nextState = [...action.locations];
            break;
        case ADD_LOCATION:
            if (!state.some(loc => loc.id === action.location.id)) {
                nextState = [...state, action.location];
            } else {
                nextState = state;
            }
            break;
        case REMOVE_LOCATION:
            nextState = state.filter(location => location.id !== action.locationId);
            break;
        default:
            nextState = state;
    }
    
    return nextState;
};

export default locationsReducer;