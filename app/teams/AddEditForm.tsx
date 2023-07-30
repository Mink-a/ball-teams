"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Team } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { nanoid } from "nanoid"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { addData, getDataByID, updateData } from "@/lib/api"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  player_count: z.string(),
  region: z.string().min(3),
  country: z.string().min(3),
  players: z.array(
    z.object({
      name: z.string(),
      id: z.string(),
    })
  ),
})

export function AddEditForm({
  setOpen,
  paymentID,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  paymentID: string
}) {
  const router = useRouter()
  const [updateTeam, setUpdateTeam] = React.useState<Team>()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      name: "",
      player_count: "0",
      region: "",
      country: "",
      players: [],
    },
  })

  if (paymentID) {
    React.useEffect(() => {
      getDataByID(paymentID).then((res) => {
        setUpdateTeam(res)
        let { name, country, region, player_count, players } = res
        form.setValue("name", name)
        form.setValue("region", region)
        form.setValue("country", country)
        form.setValue("player_count", player_count)
      })
    }, [])
  }

  function playerDelete(id: string) {
    let players = updateTeam?.players
    const allp: {
      id: string
      name: string
    }[] = []
    if (players) {
      for (let i = 0; i < players!.length; i++) {
        if (players[i].id !== id) {
          allp.push(players[i])
        }
      }
    }
    setUpdateTeam((prev) => {
      prev!.players = allp
      prev!.player_count = `${allp.length}`
      return prev
    })
  }

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    !paymentID ? createRecord(values) : updateRecord(paymentID, values)
  }

  function createRecord(values: z.infer<typeof formSchema>) {
    let id = nanoid()
    let { name, country, region } = values
    addData({ ...values })
      .then((res) => {
        setOpen(false)
        router.refresh()
      })
      .catch((err) => {
        form.setError("name", { message: err.message })
      })
  }

  function updateRecord(id: string, values: z.infer<typeof formSchema>) {
    let { name, country, region } = values
    let { player_count, players } = updateTeam!

    updateData({ player_count, players, name, country, region, id })
      .then((res) => {
        setOpen(false)
        router.refresh()
      })
      .catch((err) => {
        console.log(err)
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="bago fc" {...field} />
              </FormControl>
              {/* <FormDescription>This is your email address.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Region <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="bago" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Country <span className="text-red-700">*</span>
              </FormLabel>
              <FormControl>
                <Input type="text" placeholder="myanmar" {...field} />
              </FormControl>
              {/* <FormDescription>This is your payment amount.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <h2>Players</h2>
        {updateTeam?.players.map((t) => (
          <p
            onClick={(e) => {
              playerDelete(t.id)
              e.currentTarget.style.display = "none"
            }}
            className="w-full"
          >
            {t.name}
          </p>
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
