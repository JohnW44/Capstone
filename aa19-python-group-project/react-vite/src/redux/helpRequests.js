const LOAD_HELP_REQUESTS = 'helpRequests/LOAD';
const ADD_HELP_REQUEST = 'helpRequests/ADD';
const UPDATE_HELP_REQUEST = 'helpRequests/UPDATE';
const REMOVE_HELP_REQUEST = 'helpRequests/DELETE';

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

const deleteHelpRequestAction = (requestId) => ({
    type: REMOVE_HELP_REQUEST,
    requestId
})

export const fetchHelpRequests = () => async (dispatch) => {
    const response = await fetch('/api/help_requests/');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadHelpRequests(data.HelpRequests));
        return data.HelpRequests;
    } else {
        console.error("Error fetching help requests:", response.statusText);
    }
};

export const createHelpRequest = (requestData) => async (dispatch) => {
        const response = await fetch('/api/help_requests/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(requestData)
        });
        
        if(response.ok) {
            const newRequest = await response.json();
            dispatch(addHelpRequest(newRequest.HelpRequest));
            return newRequest.HelpRequest;
        } 
        console.error("Error creating help request:", response.statusText);
        return null;
    }


export const updateHelpRequestLocation = (helpRequestId, locationId, requestData = null, status = null) => async (dispatch) => {
    const body = {
        ...(requestData || {}),
        locationId,
        ...(status && { status })
    };

    const response = await fetch(`/api/help_requests/${helpRequestId}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(body)
    });

    if (response.ok) {
        const data = await response.json();
        dispatch(updateHelpRequest(data.HelpRequest));
        return data.HelpRequest;
    }
    return null;
};

export const updateHelpRequestStatus = (helpRequestId, status) => async (dispatch) => {
    const response = await fetch(`/api/help_requests/${helpRequestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status })
    });
    if (response.ok) {
        const data = await response.json();
        dispatch(updateHelpRequest(data.HelpRequest));
        return data.HelpRequest;
    }
    return null;
}

export const deleteHelpRequest = (requestId) => async (dispatch) => {
    const response = await fetch(`/api/help_requests/${requestId}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!response.ok) {
        console.error("Error deleting help request", response.statusText);
        return false;
    }
    dispatch(deleteHelpRequestAction(requestId));
    return true;
}

const initialState = [];

const helpRequestsReducer = (state = initialState, action) => {
    
    let nextState;
    switch (action.type) {
        case LOAD_HELP_REQUESTS:
            nextState = [...action.requests];
            break;
        case ADD_HELP_REQUEST:
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
    
    return nextState;
};

export default helpRequestsReducer;