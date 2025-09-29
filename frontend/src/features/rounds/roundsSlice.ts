import { createSlice } from '@reduxjs/toolkit';
import { roundsApi } from "./roundsApi.ts"
import type { FullRoundInfo } from "./types.ts"
import { parseISO } from "date-fns"

interface RoundState {
  round: FullRoundInfo | null;
  tillStart: number | null;
  tillEnd: number | null;
  // Кэш
  startTime: number | null;
  endTime: number | null;
}

const initialState: RoundState = {
  round: null,
  tillStart: null,
  tillEnd: null,
  startTime: null,
  endTime: null,
};

const roundsSlice = createSlice({
  name: "activeRound",
  initialState,
  reducers: {
    activate: (state,) => {
      if (!state.round) return // Не должно происходить
      state.round.status = "active"
    },
    setTillStart: (state, { payload }: { payload: number }) => {
      state.tillStart = Math.round(payload / 1000)
    },
    // finish: (state,) => {
    //   if (!state.round) return // Не должно происходить
    //   state.round.status = "finished"
    // },
    setTillEnd: (state, { payload }: { payload: number }) => {
      state.tillEnd = Math.round(payload / 1000)
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(roundsApi.endpoints.getRound.matchPending, state => {
        console.log('getRound.matchPending')
        state.round = null;
        state.tillStart = null;
        state.tillEnd = null;
        state.startTime = null;
        state.endTime = null;
      })
      .addMatcher(
        roundsApi.endpoints.getRound.matchFulfilled,
        (state, { payload }) => {
          state.round = payload
          // Кэш
          state.startTime = parseISO(state.round.startedAt).getTime()
          state.endTime = parseISO(state.round.endedAt).getTime()
        },
      )
      .addMatcher(
        roundsApi.endpoints.tap.matchFulfilled,
        (state, { payload }) => {
          if (!state.round) return
          // На случай гонок
          // Если есть информация о большем количестве нажатий
          // пришла раньше — оставляем её
          state.round.score = Math.max(payload.score, state.round.score)
        },
      )
  },
})

export const { activate, setTillStart, setTillEnd } = roundsSlice.actions;
export default roundsSlice;
