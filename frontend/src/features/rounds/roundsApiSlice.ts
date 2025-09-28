import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQuery } from "../../app/baseQuery.ts"
import type { NewRoundInfo } from "./types.ts"

type Round = {
  id: number
}

type RoundsApiResponse = Round[]

export const roundsApiSlice = createApi({
  baseQuery,
  reducerPath: "roundsApi",
  endpoints: build => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getRounds: build.query<RoundsApiResponse, void>({
      query: () => `active-rounds`,
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    addRound: build.mutation<NewRoundInfo, void>({
      query: () => ({
        url: "add-round",
        method: "POST",
        body: {},
      }),
    }),
  }),
})

export const { useGetRoundsQuery, useAddRoundMutation } = roundsApiSlice
