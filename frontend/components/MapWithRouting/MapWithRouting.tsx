'use client'

// @ts-nocheck
import { useEffect, useRef } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import 'leaflet-routing-machine'

type LatLng = [number, number]

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

export default function MapWithRouting({
  startMarker,
  endMarker,
  middleMarkers,
  onMarkerDragEnd,
  onLocationUpdate,
  onRouteUpdate,
}: {
  startMarker: LatLng | null
  endMarker: LatLng | null
  middleMarkers: LatLng[]
  onMarkerDragEnd: (type: 'start' | 'end' | 'middle', index: number, latLng: LatLng) => void
  onLocationUpdate: (type: 'start' | 'end' | 'middle', index: number, address: string) => void
  onRouteUpdate: (distance: string, duration: string) => void
}) {
  const map = useMap()
  const routingControlRef = useRef<any>(null)

  // Focus map on start marker when it changes
  useEffect(() => {
    if (startMarker && map) {
      map.flyTo(startMarker, 13)
    }
  }, [startMarker, map])

  // Add or update routing control when markers change
  useEffect(() => {
    if (startMarker && endMarker && map) {
      // Remove existing routing control if it exists
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }

      // Create waypoints including middle markers
      const waypoints = [
        L.latLng(startMarker[0], startMarker[1]),
        ...middleMarkers.map((marker) => L.latLng(marker[0], marker[1])),
        L.latLng(endMarker[0], endMarker[1]),
      ]

      // Add new routing control
      routingControlRef.current = L.Routing.control({
        waypoints,
        routeWhileDragging: true,
        show: false, // Hide the default routing control UI
        createMarker: () => null, // Disable default markers
      }).addTo(map)

      // Listen for route calculation errors
      routingControlRef.current.on('routingerror', (event: any) => {
        console.error('Routing error:', event.error)
        alert('Failed to calculate the route. Please check the start and end locations.')
      })

      // Listen for route calculation success
      routingControlRef.current.on('routesfound', (event: any) => {
        const route = event.routes[0]
        const distance = (route.summary.totalDistance / 1000).toFixed(2) // Distance in kilometers
        const duration = (route.summary.totalTime / 60).toFixed(2) // Duration in minutes
        onRouteUpdate(`${distance} KM`, `${duration} Hrs`)
      })
    }

    // Cleanup routing control when the component unmounts
    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }
    }
  }, [startMarker, endMarker, middleMarkers, map])

  // Fetch address using reverse geocoding
  const fetchAddress = async (latLng: LatLng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latLng[0]}&lon=${latLng[1]}`
      )
      const data = await response.json()
      return data.display_name
    } catch (error) {
      console.error('Error fetching address:', error)
      return null
    }
  }

  // Handle marker drag end
  const handleMarkerDragEnd = async (
    type: 'start' | 'end' | 'middle',
    index: number,
    e: L.LeafletEvent
  ) => {
    const newLatLng: LatLng = [e.target.getLatLng().lat, e.target.getLatLng().lng]
    onMarkerDragEnd(type, index, newLatLng)

    // Fetch address for the new marker position
    const address = await fetchAddress(newLatLng)
    if (address) {
      onLocationUpdate(type, index, address)
    }
  }

  return (
    <>
      {startMarker && (
        <Marker
          position={startMarker}
          icon={startIcon}
          draggable={true}
          eventHandlers={{
            click: () => map.flyTo(startMarker, 15), // Zoom in on click
            dragend: (e) => handleMarkerDragEnd('start', 0, e),
          }}
        >
          <Popup>Start Location</Popup>
        </Marker>
      )}
      {middleMarkers.map((marker, index) => (
        <Marker
          key={index}
          position={marker}
          icon={middleIcon}
          draggable={true}
          eventHandlers={{
            click: () => map.flyTo(marker, 15), // Zoom in on click
            dragend: (e) => handleMarkerDragEnd('middle', index, e),
          }}
        >
          <Popup>Middle Location {index + 1}</Popup>
        </Marker>
      ))}
      {endMarker && (
        <Marker
          position={endMarker}
          icon={endIcon}
          draggable={true}
          eventHandlers={{
            click: () => map.flyTo(endMarker, 15), // Zoom in on click
            dragend: (e) => handleMarkerDragEnd('end', 0, e),
          }}
        >
          <Popup>End Location</Popup>
        </Marker>
      )}
    </>
  )
}