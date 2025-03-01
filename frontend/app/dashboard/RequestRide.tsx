import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'

export default function RequestRide() {
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handlePickupChange = async (e) => {
    const value = e.target.value
    setPickupLocation(value)
    if (value.length > 2) {
      // This is a mock API call. Replace with your actual location search API
      const response = await fetch(`/api/location-search?query=${value}`)
      const data = await response.json()
      setSuggestions(data.suggestions)
    } else {
      setSuggestions([])
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Request a Ride</h2>
      <div className="space-y-2">
        <Label htmlFor="pickup">Pick-up location</Label>
        <Input 
          id="pickup"
          value={pickupLocation}
          onChange={handlePickupChange}
          placeholder="Enter pick-up location" 
        />
        {suggestions.length > 0 && (
          <ul className="mt-2 bg-white border rounded-md shadow-sm">
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setPickupLocation(suggestion)
                  setSuggestions([])
                }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="dropoff">Drop-off location</Label>
        <Input 
          id="dropoff"
          value={dropoffLocation}
          onChange={(e) => setDropoffLocation(e.target.value)}
          placeholder="Enter drop-off location" 
        />
      </div>
      <Button className="w-full" onClick={() => router.push('/dashboard/available-rides')}>Find Drivers</Button>
    </div>
  )
}

