'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import MapWithRouting from '@/components/MapWithRouting/MapWithRouting'
import {addDailyRoute} from "@/api/daily-routes"
// Define types
type LatLng = [number, number]
type Suggestion = {
  display_name: string
  lat: string
  lon: string
}

// Throttle function
const throttle = (func: Function, delay: number) => {
  let lastCall = 0
  return (...args: any[]) => {
    const now = new Date().getTime()
    if (now - lastCall < delay) return
    lastCall = now
    func(...args)
  }
}

export default function AddRoutePage() {
  const router = useRouter()
  const [startLocation, setStartLocation] = useState('')
  const [endLocation, setEndLocation] = useState('')
  const [startSuggestions, setStartSuggestions] = useState<Suggestion[]>([])
  const [endSuggestions, setEndSuggestions] = useState<Suggestion[]>([])
  const [startMarker, setStartMarker] = useState<LatLng | null>(null)
  const [endMarker, setEndMarker] = useState<LatLng | null>(null)
  const [middleMarkers, setMiddleMarkers] = useState<LatLng[]>([])
  const [fromDateTime, setFromDateTime] = useState<string>('')
  const [toDateTime, setToDateTime] = useState<string>('')
  const [distance, setDistance] = useState<string>('') // Distance in kilometers
  const [duration, setDuration] = useState<string>('') // Duration in minutes

  // Get user's current location on mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        // Use reverse geocoding to get the address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          .then(response => response.json())
          .then(data => {
            setStartLocation(data.display_name)
            setStartMarker([latitude, longitude])
          })
      })
    }
  }, [])

  // Throttled search function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        func(...args)
      }, delay)
    }
  }

  const debouncedSearch = useCallback(
    debounce(async (value: string, setSuggestions: (suggestions: Suggestion[]) => void) => {
      if (value.length > 2) {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=IN` // Restrict to India
        )
        const data = await response.json()
        setSuggestions(data)
      } else {
        setSuggestions([])
      }
    }, 500), // Debounce to 500ms
    []
  )

  // Handle location search and suggestions
  const handleLocationSearch = (
    value: string,
    setLocation: (value: string) => void,
    setSuggestions: (suggestions: Suggestion[]) => void
  ) => {
    setLocation(value)
    debouncedSearch(value, setSuggestions)
  }

  // Handle selecting a suggestion
  const handleSelectSuggestion = (
    suggestion: Suggestion,
    setLocation: (value: string) => void,
    setSuggestions: (suggestions: Suggestion[]) => void,
    setMarker: (marker: LatLng) => void
  ) => {
    setLocation(suggestion.display_name)
    setSuggestions([])
    const latLng: LatLng = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)]
    setMarker(latLng)
  }

  // Handle location update when marker is dragged
  const handleLocationUpdate = (type: 'start' | 'end' | 'middle', index: number, address: string) => {
    if (type === 'start') {
      setStartLocation(address)
    } else if (type === 'end') {
      setEndLocation(address)
    } else {
      // Update middle marker address (if needed)
      console.log(`Middle Marker ${index + 1} Address: ${address}`)
    }
  }

  // Handle adding a middle marker
  const handleAddMiddleMarker = () => {
    if (startMarker && endMarker) {
      const middleLatLng: LatLng = [
        (startMarker[0] + endMarker[0]) / 2,
        (startMarker[1] + endMarker[1]) / 2,
      ]
      setMiddleMarkers((prev) => [...prev, middleLatLng])
    }
  }

  // Handle removing all middle markers
  const handleRemoveAllMiddleMarkers = () => {
    setMiddleMarkers([])
  }

  // Handle saving the route
  const handleSaveRoute = async () => {
      const routeData: any = {
        start: startMarker,
        end: endMarker,
        middle: middleMarkers,
        fromDateTime: fromDateTime || null, // Optional field
        toDateTime: toDateTime || null, // Optional field
        distance,
        duration
      };
  
      try {
        const response = await addDailyRoute(routeData);
        console.log('Route saved:', response);
      } catch (error) {
        console.error('Error saving route:', error);
        alert('An error occurred while saving the route.');
      }
    };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Add New Route</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="startLocation">Start Location</Label>
          <Input 
            id="startLocation"
            value={startLocation}
            onChange={(e) => handleLocationSearch(e.target.value, setStartLocation, setStartSuggestions)}
            placeholder="Enter start location"
          />
          {startSuggestions.length > 0 && (
            <ul className="mt-2 bg-white border rounded-md shadow-sm">
              {startSuggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion, setStartLocation, setStartSuggestions, setStartMarker)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="endLocation">End Location</Label>
          <Input 
            id="endLocation"
            value={endLocation}
            onChange={(e) => handleLocationSearch(e.target.value, setEndLocation, setEndSuggestions)}
            placeholder="Enter end location"
          />
          {endSuggestions.length > 0 && (
            <ul className="mt-2 bg-white border rounded-md shadow-sm">
              {endSuggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion, setEndLocation, setEndSuggestions, setEndMarker)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="fromDateTime">From Date and Time (Optional)</Label>
          <Input 
            id="fromDateTime"
            type="datetime-local"
            value={fromDateTime}
            onChange={(e) => setFromDateTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="toDateTime">To Date and Time (Optional)</Label>
          <Input 
            id="toDateTime"
            type="datetime-local"
            value={toDateTime}
            onChange={(e) => setToDateTime(e.target.value)}
          />
        </div>
        <div className="h-[400px] relative">
          <MapContainer 
            center={[20.5937, 78.9629]} // Centered on India
            zoom={5} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapWithRouting 
              startMarker={startMarker}
              endMarker={endMarker}
              middleMarkers={middleMarkers}
              onMarkerDragEnd={(type, index, latLng) => {
                if (type === 'start') setStartMarker(latLng)
                else if (type === 'end') setEndMarker(latLng)
                else {
                  const updatedMiddleMarkers = [...middleMarkers]
                  updatedMiddleMarkers[index] = latLng
                  setMiddleMarkers(updatedMiddleMarkers)
                }
              }}
              onLocationUpdate={handleLocationUpdate}
              onRouteUpdate={(distance, duration) => {
                setDistance(distance)
                setDuration(duration)
              }}
            />
          </MapContainer>
          <div className="absolute top-2 left-20 z-[1000] flex space-x-2">
            <Button 
              className="bg-gray-800 text-white p-2 rounded-md shadow-sm text-xs"
              onClick={handleAddMiddleMarker}
            >
              Add Middle Marker
            </Button>
            <Button 
              className="bg-gray-800 text-white p-2 rounded-md shadow-sm text-xs"
              onClick={handleRemoveAllMiddleMarkers}
            >
              Remove All Middle Markers
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => router.push('/dashboard')}>Cancel</Button>
          <Button onClick={handleSaveRoute}>Save Route</Button>
        </div>
        {/* Display distance and duration */}
        <div className="mt-4">
          <p><strong>Distance:</strong> {distance}</p>
          <p><strong>Estimated Duration:</strong> {duration}</p>
        </div>
      </div>
    </div>
  )
}