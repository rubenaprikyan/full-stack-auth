import {
  Action,
  ThunkAction,
  configureStore,
  combineReducers,
} from '@reduxjs/toolkit';
import api from '@/rtk-api/rtkBase';
import { rtkQueryErrorMiddleware } from '@/rtk-api/errorHandler';

/**
 * Redux store configuration
 */
const store = configureStore({
  reducer: combineReducers({
    [api.reducerPath]: api.reducer,
  }),
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(api.middleware)
      .concat(rtkQueryErrorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch = typeof store.dispatch;

export default store;
