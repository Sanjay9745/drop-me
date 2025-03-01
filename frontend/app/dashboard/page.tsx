'use client'

import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Home, MapPin, Settings, Route, Car } from 'lucide-react'
import RequestRide from './RequestRide'
import GiveRide from './GiveRide'
import DailyRoutes from './DailyRoutes'
import UserSettings from './UserSettings'
import HomeTab from './HomeTab'
import AvailableRides from './available-rides/AvailableRides'
import { Input } from "@/components/ui/input" // Assuming you have an Input component

// You'll need to add this to your global CSS file or in the head of your HTML
import 'leaflet/dist/leaflet.css'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('home')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    // Implement your search logic here
    console.log('Searching for:', searchQuery)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Search Field */}
      <div className="p-4 border-b">
        <form onSubmit={handleSearch} className="w-full">
          <Input
            type="text"
            placeholder="Search for locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </form>
      </div>

      {/* Map Container */}
      <div className="flex-grow">
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              Your current location
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Tabs */}
      <Card className="rounded-none">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="home"><Home className="h-5 w-5" /></TabsTrigger>
              <TabsTrigger value="dailyRoutes"><Route className="h-5 w-5" /></TabsTrigger>
              <TabsTrigger value="settings"><Settings className="h-5 w-5" /></TabsTrigger>
                <TabsTrigger value="availableRides"><Car className="h-5 w-5" /></TabsTrigger>
            </TabsList>
            <TabsContent value="home"><HomeTab /></TabsContent>
            <TabsContent value="dailyRoutes"><DailyRoutes /></TabsContent>
            <TabsContent value="settings"><UserSettings /></TabsContent>
            <TabsContent value="availableRides"><AvailableRides /></TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}