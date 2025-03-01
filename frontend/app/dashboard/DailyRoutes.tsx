'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

export default function DailyRoutes() {
  const [routes, setRoutes] = useState([])
  const router = useRouter()

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Daily Routes</h2>

      <div className="grid grid-cols-2 gap-4">
      <Button onClick={() => router.push('/dashboard/add-route')}>Add New Route</Button>
      <Button onClick={() => router.push('/dashboard/view-routes')}>View Routes</Button>
      </div>
    </div>
  )
}

