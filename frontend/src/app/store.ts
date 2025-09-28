import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { roundsApiSlice } from "../features/rounds/roundsApiSlice"
import { authApi } from "../features/auth/authApi.ts"
import authSlice from "../features/auth/authSlice.ts"

const rootReducer = combineSlices(
  roundsApiSlice,
  authApi,
  authSlice,
);
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(authApi.middleware).concat(roundsApiSlice.middleware);
    },
    preloadedState,
  })
  setupListeners(store.dispatch)
  return store
}

export type AppDispatch = typeof store.dispatch
export const store = makeStore()
