import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, SessionState, LoginCredentials, SignupData, ErrorResponse } from '../types/types';

export const authenticate = createAsyncThunk(
  'session/authenticate',
  async () => {
    const response = await fetch("/api/auth/");
    if (response.ok) {
      const data = await response.json();
      if (data.errors) {
        return null;
      }
      return data;
    }
    return null;
  }
);

export const login = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: ErrorResponse }
>(
  'session/login',
  async (credentials, { rejectWithValue }) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status < 500) {
      const errorMessages = await response.json();
      return rejectWithValue(errorMessages);
    } else {
      return rejectWithValue({ server: "Something went wrong. Please try again" });
    }
  }
);

export const signup = createAsyncThunk<
  User,
  SignupData,
  { rejectValue: ErrorResponse }
>(
  'session/signup',
  async (user, { rejectWithValue }) => {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status < 500) {
      const errorMessages = await response.json();
      return rejectWithValue(errorMessages);
    } else {
      return rejectWithValue({ server: "Something went wrong. Please try again" });
    }
  }
);

export const logout = createAsyncThunk(
  'session/logout',
  async () => {
    await fetch("/api/auth/logout");
    return null;
  }
);

const initialState: SessionState = { user: null };

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default sessionSlice.reducer;
