"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import useSWRInfinite from "swr/infinite"

import { getDataByID, updateData } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import type { Team } from "../../types"

export interface Player {
  id: number
  first_name: string
  height_feet: any
  height_inches: any
  last_name: string
  position: string
  weight_pounds: any
}

// export interface Team {
//   id: number
//   abbreviation: string
//   city: string
//   conference: string
//   division: string
//   full_name: string
//   name: string
// }

const fetcher = (url: string) =>
  fetch(url).then(async (res) => {
    const resp = await res.json()
    return resp.data
  })
const PAGE_SIZE = 10

export default function PlayerList({ teams }: { teams: Team[] }) {
  const URL = "https://www.balldontlie.io/api/v1/players"

  const { data, mutate, size, setSize, isValidating, isLoading } =
    useSWRInfinite(
      (index) => `${URL}?per_page=${PAGE_SIZE}&page=${index + 1}`,
      fetcher
    )

  //   console.log(data, "inf")

  const [open, setOpen] = useState(false)
  const [plyr, setPlyr] = useState("")
  const router = useRouter()
  const players: Player[] = data ? [].concat(...data) : []
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined")
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE)
  const isRefreshing = isValidating && data && data.length === size

  const chooseTeam = async (id: string, playerId: string) => {
    const team = await getDataByID(id)
    const player = players.find((p) => p.id === +playerId)
    team.player_count = (Number(team.player_count) + 1).toString()
    team.players.push({ id: `${player?.id}`, name: player!.first_name })
    updateData({ ...team, id }).then((res) => {
      setOpen(false)
      router.refresh()
    })
  }

  let allTeamPlayers: { id: string; name: string }[] = []
  teams.forEach((t, i) => allTeamPlayers.push(...t.players))

  let matchId: Number[] = []

  for (let player of players) {
    const id = player.id
    const found = allTeamPlayers.find((r) => +r.id === id)
    if (found) {
      matchId.push(player.id)
    }
  }

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <p className="my-3">
        showing {size} page(s) of {isLoadingMore ? "..." : players.length}{" "}
        issue(s){" "}
        <Button
          className="mr-3"
          disabled={isLoadingMore || isReachingEnd}
          onClick={() => setSize(size + 1)}
        >
          {isLoadingMore
            ? "loading..."
            : isReachingEnd
            ? "no more issues"
            : "load more"}
        </Button>
        <Button disabled={!size} onClick={() => setSize(0)}>
          clear
        </Button>
      </p>
      {isEmpty ? <p>Yay, no issues found.</p> : null}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
        style={{ fontFamily: "sans-serif" }}
      >
        {players.map((player) => {
          return (
            <>
              <div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {player.first_name} {player.last_name}
                      </CardTitle>
                      {/* <CardDescription>Card Description</CardDescription> */}
                    </CardHeader>
                    <CardContent>
                      <pre>{JSON.stringify(player, null, 2)}</pre>
                    </CardContent>
                    <CardFooter>
                      <DialogTrigger
                        disabled={
                          matchId.includes(player.id) || teams.length < 1
                        }
                      >
                        <Button
                          disabled={
                            matchId.includes(player.id) || teams.length < 1
                          }
                          onClick={() => setPlyr(`${player.id}`)}
                        >
                          Add to team
                        </Button>
                      </DialogTrigger>
                    </CardFooter>
                  </Card>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="mb-3">
                        Choose a team to add player.
                      </DialogTitle>
                      <DialogDescription>
                        {teams.map((t) => (
                          <div
                            onClick={() => {
                              chooseTeam(`${t.id}`, plyr)
                            }}
                          >
                            <Button className="w-full" variant={"ghost"}>
                              {t.name}
                            </Button>
                          </div>
                        ))}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )
        })}
      </div>
    </div>
  )
}
