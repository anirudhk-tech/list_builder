import { combineSlices, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { matchSlice } from "./slices/matchSlice";

const rootReducer = combineSlices(userSlice, matchSlice);

export type MainState = ReturnType<typeof rootReducer>;

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat();
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
