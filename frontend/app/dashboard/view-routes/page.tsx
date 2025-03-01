'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, ChevronRight, Trash } from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'
import { getDailyRoutes, deleteDailyRoute } from "@/api/daily-routes"

// Define TypeScript interfaces
interface Route {
  id: string
  userId: string
  startLocation: [number, number]
  endLocation: [number, number]
  middleLocations: [number, number][]
  fromDateTime: string
  toDateTime: string
  distance: number | null
  duration: number | null
  createdAt: string
  updatedAt: string
}

// Define custom icons
const shadowUrl = '/icons/marker-shadow.png'
const startIcon = new L.Icon({
  iconUrl: '/icons/green-marker.png',
  shadowUrl: shadowUrl,
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const endIcon = new L.Icon({
  iconUrl: '/icons/flag.png',
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const middleIcon = new L.Icon({
  iconUrl: '/icons/blue-marker.png',
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

const currentLocationIcon = new L.Icon({
  iconUrl: '/icons/current-location.png', // Add a custom icon for the current location
  shadowUrl: shadowUrl,
  iconSize: [41, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export default function ViewRoutesPage() {
  const router = useRouter()
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null)
  const [dailyRoutes, setDailyRoutes] = useState<Route[]>([])
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null) // Store current location
  const mapRef = useRef<L.Map | null>(null) // Ref to store the map instance
  const routingControlRef = useRef<L.Routing.Control | null>(null) // Ref to store the routing control instance
  const markersRef = useRef<L.Marker[]>([]) // Ref to store marker instances
  const currentLocationMarkerRef = useRef<L.Marker | null>(null) // Ref to store the current location marker

  // Fetch current location using the Geolocation API
  const fetchCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation([latitude, longitude])
        },
        (error) => {
          console.error('Error fetching current location:', error)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  // Handle route selection
  const handleRouteClick = (route: Route) => {
    setSelectedRoute(route)
  }

  // Handle route deletion
  const handleDeleteRoute = async (routeId: string) => {
    try {
      await deleteDailyRoute(routeId)
      setDailyRoutes(dailyRoutes.filter(route => route.id !== routeId))
      if (selectedRoute?.id === routeId) {
        setSelectedRoute(null) // Clear selected route if it's deleted
      }
    } catch (error) {
      console.error('Failed to delete route:', error)
    }
  }

  // Fetch daily routes on component mount
  useEffect(() => {
    getDailyRoutes().then((data: any) => {
      setDailyRoutes(data.results)
    })
    fetchCurrentLocation() // Fetch current location when the component mounts
  }, [])

  // Initialize map, routing machine, and markers when a route is selected
  useEffect(() => {
    if (selectedRoute && typeof window !== 'undefined') {
      // Clean up existing map, routing control, and markers
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().waypoints = [] // Clear waypoints
        routingControlRef.current.remove()
        routingControlRef.current = null
      }
      markersRef.current.forEach(marker => {
        if (marker && marker.remove) marker.remove() // Safely remove markers
      })
      markersRef.current = [] // Clear the markers array

      // Initialize the map
      const map = L.map('map').setView(selectedRoute.startLocation, 13) // Zoom to start location
      mapRef.current = map // Store the map instance in the ref

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map)

      // Create waypoints for the routing machine
      const waypoints = [
        L.latLng(selectedRoute.startLocation[0], selectedRoute.startLocation[1]),
        ...(selectedRoute.middleLocations || []).map(loc => L.latLng(loc[0], loc[1])),
        L.latLng(selectedRoute.endLocation[0], selectedRoute.endLocation[1])
      ]

      // Initialize the routing machine
      const routingControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: true,
        show: false, // Hide the default routing control UI
        createMarker: () => null, // Disable default markers
      }).addTo(map)
      routingControlRef.current = routingControl // Store the routing control instance in the ref

      // Add markers for start, middle, and end locations
      const startMarker = L.marker(waypoints[0], { icon: startIcon }).addTo(map)
      const endMarker = L.marker(waypoints[waypoints.length - 1], { icon: endIcon }).addTo(map)
      const middleMarkers = waypoints
        .slice(1, -1) // Exclude start and end waypoints
        .map(waypoint => L.marker(waypoint, { icon: middleIcon }).addTo(map))

      // Store markers in the ref
      markersRef.current = [startMarker, ...middleMarkers, endMarker]

      // Add current location marker if available
      if (currentLocation) {
        const currentMarker = L.marker(currentLocation, { icon: currentLocationIcon }).addTo(map)
        currentLocationMarkerRef.current = currentMarker
      }
    }

    // Cleanup function to remove the map, routing control, and markers when the component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      if (routingControlRef.current) {
        routingControlRef.current.getPlan().waypoints = [] // Clear waypoints
        routingControlRef.current.remove()
        routingControlRef.current = null
      }
      markersRef.current.forEach(marker => {
        if (marker && marker.remove) marker.remove() // Safely remove markers
      })
      markersRef.current = [] // Clear the markers array
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.remove() // Remove current location marker
        currentLocationMarkerRef.current = null
      }
    }
  }, [selectedRoute, currentLocation])

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Your Daily Routes</h2>
      <Button onClick={() => router.push('/dashboard/add-route')}>Add New Route</Button>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {dailyRoutes.map((route) => (
            <Card
              key={route.id}
              className={`cursor-pointer transition-colors ${selectedRoute?.id === route.id ? 'border-primary' : ''}`}
              onClick={() => handleRouteClick(route)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Route {route.id}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Trash
                    className="h-4 w-4 text-red-500 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent card click event
                      handleDeleteRoute(route.id)
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>Start</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>End</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div id="map" style={{ height: '400px', width: '100%' }}></div>
      </div>
    </div>
  )
}