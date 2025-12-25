"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Navigation, Search } from "lucide-react";

// Types for map data
interface MapLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: "car" | "instructor" | "booking";
  status: "active" | "inactive";
}

interface MapViewProps {
  locations?: MapLocation[];
  onLocationSelect?: (location: MapLocation) => void;
  height?: string;
}

// Mock data for demonstration
const mockLocations: MapLocation[] = [
  {
    id: "1",
    name: "Trung tâm đào tạo lái xe Hà Nội",
    address: "123 Đường Giải Phóng, Hai Bà Trưng, Hà Nội",
    lat: 21.0285,
    lng: 105.8542,
    type: "instructor",
    status: "active"
  },
  {
    id: "2", 
    name: "Xe Honda Civic",
    address: "456 Đường Láng, Đống Đa, Hà Nội",
    lat: 21.0123,
    lng: 105.8234,
    type: "car",
    status: "active"
  },
  {
    id: "3",
    name: "Đặt xe số 001",
    address: "789 Đường Cầu Giấy, Cầu Giấy, Hà Nội", 
    lat: 21.0456,
    lng: 105.7890,
    type: "booking",
    status: "active"
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletMap = any;

export function MapView({ 
  locations = mockLocations, 
  onLocationSelect,
  height = "400px" 
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<LeafletMap>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize map (using Leaflet as example)
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      try {
        // Dynamic import for Leaflet (client-side only)
        const L = await import("leaflet");
        
        // Initialize map
        const mapInstance = L.map(mapRef.current).setView([21.0285, 105.8542], 13);
        
        // Add tile layer (OpenStreetMap)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance);

        // Add markers for each location
        locations.forEach((location) => {
          const marker = L.marker([location.lat, location.lng])
            .addTo(mapInstance)
            .bindPopup(`
              <div class="p-2">
                <h3 class="font-semibold">${location.name}</h3>
                <p class="text-sm text-gray-600">${location.address}</p>
                <p class="text-xs text-gray-500">Loại: ${location.type}</p>
              </div>
            `);

          // Add click handler
          marker.on("click", () => {
            setSelectedLocation(location);
            onLocationSelect?.(location);
          });
        });

        setMap(mapInstance);
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initMap();
  }, [locations, onLocationSelect]);

  // Search functionality
  const handleSearch = () => {
    if (!map || !searchTerm) return;
    
    setIsLoading(true);
    
    // Simulate geocoding API call
    setTimeout(() => {
      // In real implementation, you would call a geocoding API here
      // For demo, we'll just search in our mock data
      const foundLocation = locations.find(loc => 
        loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loc.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (foundLocation) {
        map.setView([foundLocation.lat, foundLocation.lng], 15);
        setSelectedLocation(foundLocation);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // Filter locations based on search
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Tìm kiếm vị trí
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">
                Tìm kiếm địa điểm
              </Label>
              <Input
                id="search"
                placeholder="Nhập tên địa điểm hoặc địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              {isLoading ? "Đang tìm..." : "Tìm kiếm"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <Card>
        <CardContent className="p-0">
          <div 
            ref={mapRef} 
            className="w-full rounded-lg"
            style={{ height }}
          />
        </CardContent>
      </Card>

      {/* Location List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách vị trí</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedLocation?.id === location.id 
                    ? "bg-blue-50 border-blue-200" 
                    : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  setSelectedLocation(location);
                  onLocationSelect?.(location);
                  if (map) {
                    map.setView([location.lat, location.lng], 15);
                  }
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{location.name}</h4>
                    <p className="text-sm text-gray-600">{location.address}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        location.type === "car" 
                          ? "bg-green-100 text-green-800"
                          : location.type === "instructor"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {location.type === "car" ? "Xe" : 
                         location.type === "instructor" ? "Hướng dẫn viên" : "Đặt xe"}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        location.status === "active" 
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {location.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (map) {
                        map.setView([location.lat, location.lng], 15);
                      }
                    }}
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Example usage component
export function MapViewExample() {
  const handleLocationSelect = (location: MapLocation) => {
    console.log("Selected location:", location);
    // Handle location selection logic here
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Bản đồ vị trí</h1>
      <MapView 
        onLocationSelect={handleLocationSelect}
        height="500px"
      />
    </div>
  );
}

