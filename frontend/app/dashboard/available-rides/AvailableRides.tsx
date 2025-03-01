'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Clock, DollarSign } from 'lucide-react'

interface Ride {
  id: string
  driverName: string
  driverRating: number
  estimatedTime: string
  price: number
  carModel: string
}

const mockRides: Ride[] = [
  { id: '1', driverName: 'John Doe', driverRating: 4.8, estimatedTime: '5 mins', price: 12.50, carModel: 'Toyota Camry' },
  { id: '2', driverName: 'Jane Smith', driverRating: 4.9, estimatedTime: '8 mins', price: 11.00, carModel: 'Honda Civic' },
  { id: '3', driverName: 'Mike Johnson', driverRating: 4.7, estimatedTime: '10 mins', price: 10.50, carModel: 'Ford Focus' },
]

export default function AvailableRides() {
  const [selectedRide, setSelectedRide] = useState<string | null>(null)
  const router = useRouter()

  const handleSelectRide = (rideId: string) => {
    setSelectedRide(rideId)
  }

  const handleConfirmRide = () => {
    if (selectedRide) {
      // In a real app, you would send this selection to your backend
      console.log(`Confirmed ride with ID: ${selectedRide}`)
      // Navigate to a confirmation or tracking page
      router.push('/dashboard')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Available Rides</h2>
      <div className="space-y-4">
        {mockRides.map((ride) => (
          <Card 
            key={ride.id} 
            className={`cursor-pointer transition-colors ${selectedRide === ride.id ? 'border-primary' : ''}`}
            onClick={() => handleSelectRide(ride.id)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {ride.driverName}
              </CardTitle>
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{ride.driverRating.toFixed(1)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${ride.driverName}`} />
                    <AvatarFallback>{ride.driverName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{ride.carModel}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{ride.estimatedTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center font-medium">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>{ride.price.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button 
        className="w-full" 
        disabled={!selectedRide}
        onClick={handleConfirmRide}
      >
        Confirm Ride
      </Button>
    </div>
  )
}

