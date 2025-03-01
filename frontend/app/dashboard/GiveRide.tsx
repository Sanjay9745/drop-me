import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function GiveRide() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Offer a Ride</h2>
      <Input placeholder="Starting point" />
      <Input placeholder="Destination" />
      <Input type="number" placeholder="Available seats" />
      <Button className="w-full">Offer Ride</Button>
    </div>
  )
}

