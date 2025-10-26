"use client";

import { MapView, MapViewExample } from "@/components/ui/map-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Car, Users, Calendar } from "lucide-react";

// Mock data for different types of locations
const carLocations = [
  {
    id: "1",
    name: "Honda Civic 2024",
    address: "123 Đường Giải Phóng, Hai Bà Trưng, Hà Nội",
    lat: 21.0285,
    lng: 105.8542,
    type: "car" as const,
    status: "active" as const
  },
  {
    id: "2",
    name: "Toyota Camry 2023",
    address: "456 Đường Láng, Đống Đa, Hà Nội",
    lat: 21.0123,
    lng: 105.8234,
    type: "car" as const,
    status: "active" as const
  },
  {
    id: "3",
    name: "VinFast VF8",
    address: "789 Đường Cầu Giấy, Cầu Giấy, Hà Nội",
    lat: 21.0456,
    lng: 105.7890,
    type: "car" as const,
    status: "inactive" as const
  }
];

const instructorLocations = [
  {
    id: "1",
    name: "Nguyễn Văn A - Hướng dẫn viên",
    address: "123 Đường Giải Phóng, Hai Bà Trưng, Hà Nội",
    lat: 21.0285,
    lng: 105.8542,
    type: "instructor" as const,
    status: "active" as const
  },
  {
    id: "2",
    name: "Trần Thị B - Hướng dẫn viên",
    address: "456 Đường Láng, Đống Đa, Hà Nội",
    lat: 21.0123,
    lng: 105.8234,
    type: "instructor" as const,
    status: "active" as const
  }
];

const bookingLocations = [
  {
    id: "1",
    name: "Đặt xe #001 - Honda Civic",
    address: "123 Đường Giải Phóng, Hai Bà Trưng, Hà Nội",
    lat: 21.0285,
    lng: 105.8542,
    type: "booking" as const,
    status: "active" as const
  },
  {
    id: "2",
    name: "Đặt xe #002 - Toyota Camry",
    address: "456 Đường Láng, Đống Đa, Hà Nội",
    lat: 21.0123,
    lng: 105.8234,
    type: "booking" as const,
    status: "active" as const
  }
];

export default function MapDemoPage() {
  const handleLocationSelect = (location: any) => {
    console.log("Selected location:", location);
    // Here you can implement your logic for handling location selection
    // For example: navigate to detail page, show modal, etc.
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Demo Map View</h1>
        <p className="text-muted-foreground">
          Ví dụ về cách sử dụng Map API trong view
        </p>
      </div>

      <Tabs defaultValue="cars" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cars" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            Xe
          </TabsTrigger>
          <TabsTrigger value="instructors" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Hướng dẫn viên
          </TabsTrigger>
          <TabsTrigger value="bookings" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Đặt xe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vị trí xe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapView 
                locations={carLocations}
                onLocationSelect={handleLocationSelect}
                height="500px"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vị trí hướng dẫn viên
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapView 
                locations={instructorLocations}
                onLocationSelect={handleLocationSelect}
                height="500px"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Vị trí đặt xe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MapView 
                locations={bookingLocations}
                onLocationSelect={handleLocationSelect}
                height="500px"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Cách sử dụng Map API</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Cài đặt thư viện map:</h3>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
              <div># Sử dụng Leaflet (miễn phí)</div>
              <div>npm install leaflet react-leaflet</div>
              <div>npm install @types/leaflet</div>
              <div className="mt-2"># Hoặc Google Maps</div>
              <div>npm install @googlemaps/js-api-loader</div>
              <div className="mt-2"># Hoặc Mapbox</div>
              <div>npm install mapbox-gl</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Cách sử dụng trong component:</h3>
            <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
              <div>{"import { MapView } from '@/components/ui/map-view';"}</div>
              <div className="mt-2">{"<MapView"}</div>
              <div>{"  locations={yourLocations}"}</div>
              <div>{"  onLocationSelect={handleLocationSelect}"}</div>
              <div>{"  height='500px'"}</div>
              <div>{"/>"}</div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. API endpoints thường dùng:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Geocoding API:</strong> Chuyển đổi địa chỉ thành tọa độ lat/lng</li>
              <li><strong>Reverse Geocoding:</strong> Chuyển đổi tọa độ thành địa chỉ</li>
              <li><strong>Directions API:</strong> Tính toán đường đi giữa các điểm</li>
              <li><strong>Places API:</strong> Tìm kiếm địa điểm xung quanh</li>
              <li><strong>Distance Matrix API:</strong> Tính khoảng cách và thời gian di chuyển</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

