import type { Team } from "../types"

const baseUrl = "http://localhost:3000/data"

export const getAllData = async (): Promise<Team[]> => {
  const res = await fetch(`${baseUrl}`, { cache: "no-store" })
  // Recommendation: handle errors
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export const getDataByID = async (id: string): Promise<Team> => {
  const res = await fetch(`${baseUrl}/${id}`)
  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export const addData = async (rec: any) => {
  const res = await fetch(`${baseUrl}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rec),
  })
  if (!res.ok) {
    throw new Error(res.statusText)
  }
  return res.json()
}

export const updateData = async (rec: Team) => {
  const res = await fetch(`${baseUrl}/${rec.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rec),
  })
  return res.json()
}

export const deleteData = async (id: string) => {
  await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
  })
}
