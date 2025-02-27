import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { HelpRequest, HelpRequestsState, CreateHelpRequestData, UpdateHelpRequestData } from '../types/types';

export const fetchHelpRequests = createAsyncThunk(
  'helpRequests/fetchAll',
  async () => {
    const response = await fetch('/api/help_requests/');
    if (response.ok) {
      const data = await response.json();
      return data.HelpRequests;
    }
    return null;
  }
);

export const createHelpRequest = createAsyncThunk(
  'helpRequests/create',
  async (requestData: CreateHelpRequestData) => {
    const response = await fetch('/api/help_requests/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      const newRequest = await response.json();
      return newRequest.HelpRequest;
    }
    return null;
  }
);

export const updateHelpRequestLocation = createAsyncThunk(
  'helpRequests/updateLocation',
  async ({ 
    helpRequestId, 
    locationId, 
    requestData, 
    status 
  }: { 
    helpRequestId: number; 
    locationId?: number; 
    requestData?: UpdateHelpRequestData; 
    status?: string 
  }) => {
    const body = {
      ...(requestData || {}),
      locationId,
      ...(status && { status })
    };

    const response = await fetch(`/api/help_requests/${helpRequestId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      return data.HelpRequest;
    }
    return null;
  }
);


const initialState: HelpRequestsState = [];

const helpRequestsSlice = createSlice({
  name: 'helpRequests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHelpRequests.fulfilled, (state, action) => {
        if (action.payload) {
          return action.payload;
        }
        return state;
      })
      .addCase(createHelpRequest.fulfilled, (state, action) => {
        if (action.payload) {
          state.push(action.payload);
        }
      })
      .addCase(updateHelpRequestLocation.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.findIndex(request => request.id === action.payload!.id);
          if (index !== -1) {
            state[index] = action.payload;
          }
        }
      });
  }
});

export default helpRequestsSlice.reducer;