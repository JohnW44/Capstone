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

const updateHelpRequest = (request) => ({
    type: UPDATE_HELP_REQUEST,
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
    console.log("🚀 Starting createHelpRequest thunk with data:", requestData);
    try {
        const response = await fetch('/api/help_requests/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(requestData)
        });
        console.log("📨 API Response status:", response.status);
        
        if(response.ok) {
            const newRequest = await response.json();
            console.log("✅ Successful API response:", newRequest);
            dispatch(addHelpRequest(newRequest.HelpRequest));
            return newRequest.HelpRequest;
        } else {
            const errorData = await response.json();
            console.error("❌ API error:", errorData);
        }
    } catch (error) {
        console.error("🔥 Thunk error:", error);
    }
}

export const updateHelpRequestLocation = (helpRequestId, locationId) => async (dispatch) => {
    const response = await fetch(`/api/help_requests/${helpRequestId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ 
            locationId: locationId
        })
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateHelpRequest(data.HelpRequest));
        return data.HelpRequest;
    }
    return null;
};

const initialState = [];

const helpRequestsReducer = (state = initialState, action) => {
    console.log("🔄 Reducer received action:", action.type);
    console.log("📥 Current state:", state);
    console.log("📦 Action payload:", action);
    
    let nextState;
    switch (action.type) {
        case LOAD_HELP_REQUESTS:
            nextState = [...action.requests];
            break;
        case ADD_HELP_REQUEST:
            console.log("➕ Adding new request:", action.request);
            nextState = [...state, action.request];
            break;
        case UPDATE_HELP_REQUEST:
            nextState = state.map(request => 
                request.id === action.request.id ? action.request : request
            );
            break;
        case REMOVE_HELP_REQUEST:
            nextState = state.filter(request => request.id !== action.requestId);
            break;
        default:
            nextState = state;
    }
    
    console.log("📤 Next state:", nextState);
    return nextState;
};

export default helpRequestsReducer;