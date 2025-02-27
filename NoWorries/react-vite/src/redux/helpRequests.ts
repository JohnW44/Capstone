import { AppDispatch, RootState } from "./store";


// typed as string constants
const LOAD_HELP_REQUESTS = 'helpRequests/LOAD';
const ADD_HELP_REQUEST = 'helpRequests/ADD';
const UPDATE_HELP_REQUEST = 'helpRequests/UPDATE';
const REMOVE_HELP_REQUEST = 'helpRequests/DELETE';
const UPDATE_REQUEST_CATEGORIES = 'helpRequests/UPDATE_CATEGORIES';

//defines what a HelpRequest object looks like
interface HelpRequest {
  id: number;
  userId: number;
  locationId: number | null;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  categories?: Category[]; // Optional property for categories
}

// Interface for Category if needed
interface Category {
  id: number;
  name: string;
}

// Define interfaces for each action type
interface LoadHelpRequestsAction {
  type: typeof LOAD_HELP_REQUESTS;
  requests: HelpRequest[];
}

interface AddHelpRequestAction {
  type: typeof ADD_HELP_REQUEST;
  request: HelpRequest;
}

interface UpdateHelpRequestAction {
  type: typeof UPDATE_HELP_REQUEST;
  request: HelpRequest;
}

interface RemoveHelpRequestAction {
  type: typeof REMOVE_HELP_REQUEST;
  requestId: number;
}

interface UpdateRequestCategoriesAction {
  type: typeof UPDATE_REQUEST_CATEGORIES;
  request: HelpRequest;
}

// Union type for all possible action types
type HelpRequestActionTypes = 
  | LoadHelpRequestsAction 
  | AddHelpRequestAction 
  | UpdateHelpRequestAction 
  | RemoveHelpRequestAction 
  | UpdateRequestCategoriesAction;

// Action creators with proper TypeScript return types
const loadHelpRequests = (requests: HelpRequest[]): LoadHelpRequestsAction => {
    return {
        type: LOAD_HELP_REQUESTS,
        requests
    };
};

const addHelpRequest = (request: HelpRequest): AddHelpRequestAction => ({
    type: ADD_HELP_REQUEST,
    request
});

const updateHelpRequest = (request: HelpRequest): UpdateHelpRequestAction => ({
    type: UPDATE_HELP_REQUEST,
    request
});

const deleteHelpRequestAction = (requestId: number): RemoveHelpRequestAction => ({
    type: REMOVE_HELP_REQUEST,
    requestId
});

const updateRequestCategories = (request: HelpRequest): UpdateRequestCategoriesAction => ({
    type: UPDATE_REQUEST_CATEGORIES,
    request
});

// Interface for creating a new help request
interface CreateHelpRequestData {
  title: string;
  description: string;
  locationId?: number | null;
  status?: string;
  categoryIds?: number[];
}

// Interface for updating a help request
interface UpdateHelpRequestData {
  title?: string;
  description?: string;
  status?: string;
}

export const fetchHelpRequests = () => async (dispatch: AppDispatch) => {
    const response = await fetch('/api/help_requests/');
    if (response.ok) {
        const data = await response.json();
        dispatch(loadHelpRequests(data.HelpRequests));
        return data.HelpRequests;
    } else {
        console.error("Error fetching help requests:", response.statusText);
        return null;
    }
};

export const createHelpRequest = (requestData: CreateHelpRequestData) => async (dispatch: AppDispatch) => {
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
};

export const updateHelpRequestLocation = (
    helpRequestId: number, 
    locationId?: number,  //coud also be written like: locationId: number | null,
    requestData?: UpdateHelpRequestData, 
    status?: string
) => async (dispatch: AppDispatch) => {
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

export const updateHelpRequestStatus = (helpRequestId: number, status: string) => async (dispatch: AppDispatch) => {
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
};

export const deleteHelpRequest = (requestId: number) => async (dispatch: AppDispatch) => {
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
};

export const updateHelpRequestCategories = (requestId: number, categoryIds: number[]) => async (dispatch: AppDispatch) => {
    console.log('Updating categories for request:', requestId);
    console.log('New category IDs:', categoryIds);

    const response = await fetch(`/api/help_requests/${requestId}/categories`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ categoryIds })
    });

    console.log('Response status:', response.status);

    if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        dispatch(updateRequestCategories(data.HelpRequest));
        return data.HelpRequest;
    }
    return null;
};

// Define the state type for this reducer
type HelpRequestsState = HelpRequest[];

// Initial state with type annotation
const initialState: HelpRequestsState = [];

// Reducer with TypeScript
const helpRequestsReducer = (
    state: HelpRequestsState = initialState, 
    action: HelpRequestActionTypes
): HelpRequestsState => {
    
    let nextState: HelpRequestsState;
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
        case UPDATE_REQUEST_CATEGORIES:
            nextState = state.map(request => 
                request.id === action.request.id ? action.request : request
            );
            break;
        default:
            nextState = state;
    }
    
    return nextState;
};

export default helpRequestsReducer; 