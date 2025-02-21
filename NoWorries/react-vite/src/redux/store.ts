import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
  PreloadedState,
} from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import helpRequestsReducer from "./helpRequests";
import locationsReducer from "./locations";
import categoriesReducer from "./categories";

// Declare Global augmentation for redux devtools extension
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const rootReducer = combineReducers({
  session: sessionReducer,
  helpRequests : helpRequestsReducer,
  locations: locationsReducer,
  categories: categoriesReducer
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

export type RootState = ReturnType<typeof rootReducer>; //this gets the type of combined reducers
export type AppStore = Store<RootState>
export type AppDispatch = AppStore['dispatch'] 

const configureStore = (preloadedState?: PreloadedState<RootState>): Store => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
