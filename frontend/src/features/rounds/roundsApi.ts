import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQuery } from "../../app/baseQuery.ts"
import type { FullRoundInfo, NewRoundInfo, RoundsListDTO, TapResult } from "./types.ts"


export const roundsApi = createApi({
  baseQuery,
  reducerPath: "roundsApi",
  endpoints: build => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getRounds: build.query<RoundsListDTO, void>({
      query: () => 'all-rounds',  // or 'active-rounds'
    }),
    getRound: build.query<FullRoundInfo, string>({
      query: (id) => `round/${id}`,
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    addRound: build.mutation<NewRoundInfo, void>({
      query: () => ({
        url: "add-round",
        method: "POST",
        body: {},
      }),
    }),
    tap: build.mutation<TapResult, string>({
      query: (id) => ({
        url: `tap/${id}`,
        method: "GET",
      }),
    })
  }),
})

export const { useGetRoundsQuery, useAddRoundMutation, useGetRoundQuery } = roundsApi;
