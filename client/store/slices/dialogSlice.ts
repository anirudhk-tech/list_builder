import { createSlice } from "@reduxjs/toolkit";

export interface DialogSlice {
  deleteDialogOpen: boolean;
}

const initialState: DialogSlice = {
  deleteDialogOpen: false,
};

export const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setDeleteDataDialogState: (state, action) => {
      state.deleteDialogOpen = action.payload;
    },
  },
});

export const { setDeleteDataDialogState } = dialogSlice.actions;
export default dialogSlice.reducer;
