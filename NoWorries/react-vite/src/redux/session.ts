import { AppDispatch } from "./store";

//Types
interface User{ //Describes what the user object looks like with 3 properties so far
  id: number;
  email: string;
  username: string;
}

interface SessionState { //defines state shape for the session. User object or null
  user: User | null;
}

interface SetUserAction { //structure of user redux actions. Needs payload
  type: typeof SET_USER;
  payload: User;
}

interface RemoveUserAction {  // just needs type
  type: typeof REMOVE_USER;
}

type SessionActionTypes = SetUserAction | RemoveUserAction; //Union type where any Session action must be set or remove

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user: User): SetUserAction => ({
  type: SET_USER,
  payload: user
});

const removeUser = (): RemoveUserAction => ({
  type: REMOVE_USER
});

export const thunkAuthenticate = () => async (dispatch: AppDispatch) => { //Authentication action that checks if user is already logged in
	const response = await fetch("/api/auth/");
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
  console.log("Auth check response:", response);
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface ErrorResponse {
  server?: string;
  [key: string]: string | undefined;
}

export const thunkLogin = (credentials: LoginCredentials) => async (dispatch: AppDispatch) => { //Login thunk that takes credentials
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

interface SignupData extends LoginCredentials {
  username: string;
}

export const thunkSignup = (user: SignupData) => async (dispatch: AppDispatch) => { //signup thunk similar to login but with additional username field(line 78) 
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  });

  if(response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
  } else if (response.status < 500) {
    const errorMessages: ErrorResponse = await response.json();
    return errorMessages
  } else {
    return { server: "Something went wrong. Please try again" }
  }
};

export const thunkLogout = () => async (dispatch: AppDispatch) => { //Logout thunk that clears session
  await fetch("/api/auth/logout");
  dispatch(removeUser());
};

const initialState: SessionState = { user: null }; //default state when app starts

function sessionReducer(state: SessionState = initialState, action: SessionActionTypes): SessionState { //takes current state defaulting to initial. Returns new state
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;
