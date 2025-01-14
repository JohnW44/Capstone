const LOAD_LOCATIONS = 'locations/LOAD'
const ADD_LOCATION = 'locations/ADD'

const loadLocations = (locations) => ({
    type: LOAD_LOCATIONS,
    locations
})

const addLocation = (location) => ({
    type: ADD_LOCATION,
    location
})

export const fetchLocations = () => async (dispatch) => {
    const response = await fetch('/api/locations');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadLocations(data.locations));
    }
};

export const createLocation = (locationData) => async (dispatch) => {
    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf_token='))
        ?.split('=')[1];

    const response = await fetch('/api/locations/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
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
};

const locationsReducer = (state = [], action) => {
    console.log(" action", action.type, "@", new Date().toLocaleTimeString());
    console.log(" prev state", state);
    console.log(" action     ", action);
    
    let nextState;
    let existingLocations;
    
    switch (action.type) {
        case LOAD_LOCATIONS:
            nextState = [...action.locations];
            break;
        case ADD_LOCATION:
            nextState = [...state, action.location];
            break;
        default:
            nextState = state;
    }
    
    console.log(" next state", nextState);
    return nextState;
};

export default locationsReducer;