import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mockIssues, mockSensors } from '../../services/mock';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Fix for default marker icon in leaflet
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView() {
  const center: [number, number] = [9.0192, 38.7525]; // Addis Ababa

  return (
    <div className="h-[calc(100vh-12rem)] space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Geospatial View</h1>
          <p className="text-muted-foreground">Real-time visualization of issues and infrastructure sensors.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Issues: {mockIssues.length}
          </Badge>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Sensors: {mockSensors.length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        <div className="lg:col-span-3 rounded-xl border overflow-hidden shadow-sm relative z-0">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mockIssues.map((issue) => (
              <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-sm">{issue.title}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{issue.woreda}, {issue.zone}</p>
                    <Badge variant={issue.priority === 'urgent' ? 'destructive' : 'secondary'} className="text-[10px] capitalize">
                      {issue.priority}
                    </Badge>
                  </div>
                </Popup>
              </Marker>
            ))}
            {mockSensors.map((sensor) => (
              <Marker 
                key={sensor.id} 
                position={[sensor.latitude, sensor.longitude]}
                icon={new L.Icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-sm">{sensor.locationName}</h3>
                    <p className="text-xs text-muted-foreground mb-2 capitalize">{sensor.sensorType}</p>
                    <div className="text-lg font-bold text-green-600">
                      {sensor.lastReading}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Filter Layers</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked id="layer-issues" />
                <label htmlFor="layer-issues" className="text-sm">Infrastructure Issues</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" defaultChecked id="layer-sensors" />
                <label htmlFor="layer-sensors" className="text-sm">IoT Sensors</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="layer-technicians" />
                <label htmlFor="layer-technicians" className="text-sm">Active Technicians</label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm">Legend</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Standard Issue</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Critical Issue</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>IoT Sensor</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
