const LOAD_LOCATIONS = 'locations/LOAD'

const loadLocations = (locations) => ({
    type: LOAD_LOCATIONS,
    locations
})

export const fetchLocations = () => async (dispatch) => {
    const response = await fetch ('/api/locations');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadLocations(data.locations));
        return data.Locations;
    }
}

const locationsReducer = (state = [], action) => {
    switch (action.type) {
        case LOAD_LOCATIONS:
            return action.locations;
        default:
            return state;
    }
}

export default locationsReducer;