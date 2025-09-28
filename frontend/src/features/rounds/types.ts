export type NewRoundInfo = {
  id: string
}

export interface RoundItem {
  id: number;
  createdAt: string;
  startedAt: string;
  endedAt: string;
  status: string;
  score: number;
}

export interface FullRoundInfo extends RoundItem {

}

export type RoundsListDTO = RoundItem[]
