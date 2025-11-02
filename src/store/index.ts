
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';



const uiSlice = createSlice({
  name: "ui",
  initialState: { isCreateOpen: false, isEditOpen: false, searchQuery: "" },
  reducers: {
    setOpenCreate(state, action: PayloadAction<boolean>) {
      state.isCreateOpen = action.payload;
    },
    setOpenEdit(state, action: PayloadAction<boolean>) {
      state.isEditOpen = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});


export const uiActions = uiSlice.actions;
export const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();