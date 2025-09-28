import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { roundsApi } from "../features/rounds/roundsApi.ts"
import { authApi } from "../features/auth/authApi.ts"
import authSlice from "../features/auth/authSlice.ts"
import roundsSlice from "../features/rounds/roundsSlice.ts"

const rootReducer = combineSlices(
  roundsApi,
  roundsSlice,
  authApi,
  authSlice,
);
export type RootState = ReturnType<typeof rootReducer>

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return getDefaultMiddleware().concat(authApi.middleware).concat(roundsApi.middleware);
    },
    preloadedState,
  })
  setupListeners(store.dispatch)
  return store
}

export type AppDispatch = typeof store.dispatch
export const store = makeStore()
