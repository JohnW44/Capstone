import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './sessionSlice.ts';
import helpRequestsReducer from './helpRequestsSlice.ts';
import locationsReducer from './locationsSlice.ts';
import categoriesReducer from './categoriesSlice.ts';

// Declare Global augmentation for redux devtools extension
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const store = configureStore({
  reducer: {
    session: sessionReducer,
    helpRequests: helpRequestsReducer,
    locations: locationsReducer,
    categories: categoriesReducer
  },
  middleware: (getDefaultMiddleware) => {
    if (import.meta.env.MODE === 'production') {
      return getDefaultMiddleware();
    } else {
      const logger = require('redux-logger').default;
      return getDefaultMiddleware().concat(logger);
    }
  },
  devTools: import.meta.env.MODE !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
