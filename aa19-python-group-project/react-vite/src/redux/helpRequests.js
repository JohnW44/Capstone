const LOAD_HELP_REQUESTS = 'helpRequests/LOAD';
const ADD_HELP_REQUEST = 'helpRequests/ADD';
const UPDATE_HELP_REQUEST = 'helpRequests/UPDATE';
const REMOVE_HELP_REQUEST = 'helpRequests/REMOVE';

const loadHelpRequests = (requests) => {
    return {
        type: LOAD_HELP_REQUESTS,
        requests
    };
};

const addHelpRequest = (request) => ({
    type: ADD_HELP_REQUEST,
    request
});

export const fetchHelpRequests = () => async (dispatch) => {
    console.log("Fetching help requests...");
    const response = await fetch('/api/help_requests');
    if (response.ok) {
        const data = await response.json();
        console.log("Help Requests API Response:", data);
        dispatch(loadHelpRequests(data.HelpRequests));
        return data.HelpRequests;
    } else {
        console.error("Error fetching help requests:", response.statusText);
    }
};

export const createHelpRequest = (requestData) => async (dispatch) => {
    const response = await fetch('/api/help_requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    });

    if(response.ok) {
        const newRequest = await response.json();
        dispatch(addHelpRequest(newRequest));
        return newRequest;
    }
}

const initialState = [];

const helpRequestsReducer = (state = initialState, action) => {
    console.log("Reducer received action:", action.type);
    switch (action.type) {
        case LOAD_HELP_REQUESTS:
            console.log("Setting help requests in state:", action.requests);
            return [...action.requests];
        case ADD_HELP_REQUEST:
            return [...state, action.request];
        case UPDATE_HELP_REQUEST:
            return state.map(request => 
                request.id === action.request.id ? action.request : request
            );
        case REMOVE_HELP_REQUEST:
            return state.filter(request => request.id !== action.requestId);
        default:
            return state;
    }
};

export default helpRequestsReducer;