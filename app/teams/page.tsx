import type { Payment } from "@/types"

import { getAllData } from "@/lib/api"

import { columns } from "./columns"
import { DataTable } from "./data-table"

export default async function DemoPage() {
  const data = await getAllData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
