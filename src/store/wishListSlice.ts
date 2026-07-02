import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ID = string | number;

interface WishListState {
  ids: ID[];
}

const loadFromStorage = (): ID[] => {
  try {
    const stored = localStorage.getItem('wishList');
    return stored ? (JSON.parse(stored) as ID[]) : [];
  } catch {
    return [];
  }
};

const wishListSlice = createSlice({
  name: 'wishList',
  initialState: { ids: loadFromStorage() } as WishListState,
  reducers: {
    toggleWish(state, action: PayloadAction<ID>) {
      const id = action.payload;
      const idx = state.ids.indexOf(id);
      if (idx >= 0) {
        state.ids.splice(idx, 1);
      } else {
        state.ids.push(id);
      }
    },
  },
});

export const { toggleWish } = wishListSlice.actions;
export default wishListSlice.reducer;
