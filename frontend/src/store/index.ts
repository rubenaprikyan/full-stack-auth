import {
  Action,
  ThunkAction,
  configureStore,
  combineReducers,
} from '@reduxjs/toolkit';
import api from '@/rtk-api/rtkBase';

/**
 * Redux store configuration
 */
const store = configureStore({
  reducer: combineReducers({
    [api.reducerPath]: api.reducer,
  }),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch = typeof store.dispatch;

export default store;
