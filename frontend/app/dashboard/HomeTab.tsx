import { Button } from "@/components/ui/button"

export default function HomeTab() {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Welcome to RideNow</h2>
      <p>Quick actions:</p>
      <div className="grid grid-cols-2 gap-4">
        <Button>Request a Ride</Button>
        <Button>Offer a Ride</Button>
      </div>
    </div>
  )
}

