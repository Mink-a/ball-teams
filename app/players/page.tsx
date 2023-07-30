import { getAllData } from "@/lib/api"
import type { Team } from "../../types"
import PlayerList from "./player-list"

export default async function PlayersPage() {
  const teams = await getAllData()
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <PlayerList teams={teams} />
    </section>
  )
}
