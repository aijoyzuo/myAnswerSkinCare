import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './messageSlice';
import wishListReducer from './wishListSlice';

export const store = configureStore({
  reducer: {
    message: messageReducer,
    wishList: wishListReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem('wishList', JSON.stringify(store.getState().wishList.ids));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
