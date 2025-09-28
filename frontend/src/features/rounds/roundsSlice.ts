import { createSlice } from '@reduxjs/toolkit';
import { roundsApi } from "./roundsApi.ts"
import type { FullRoundInfo } from "./types.ts"

interface RoundState {
  round: FullRoundInfo | null;
}

const initialState: RoundState = {
  round: null,
};

const roundsSlice = createSlice({
  name: "activeRound",
  initialState,
  reducers: {
    activate: (state,) => {
      if (!state.round) return; // Не должно происходить
      state.round.status = 'active';
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(roundsApi.endpoints.getRound.matchPending, state => {
        state.round = null
      })
      .addMatcher(
        roundsApi.endpoints.getRound.matchFulfilled,
        (state, { payload }) => {
          state.round = payload
        },
      )
  },
})

export const { activate } = roundsSlice.actions;
export default roundsSlice;
