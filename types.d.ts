export type Team = {
  id: string
  name: string
  region: string
  country: string
  player_count: string
  players: { id: string; name: string }[]
}
