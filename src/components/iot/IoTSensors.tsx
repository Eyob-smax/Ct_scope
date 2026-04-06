import React from 'react';
import { 
  Cpu, 
  Activity, 
  Zap, 
  Droplets, 
  Wind, 
  Trash2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { mockSensors } from '../../services/mock';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

export default function IoTSensors() {
  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'water': return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'flood': return <Activity className="h-5 w-5 text-red-500" />;
      case 'electricity': return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'vibration': return <Activity className="h-5 w-5 text-orange-500" />;
      default: return <Cpu className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Online</Badge>;
      case 'offline': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Offline</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IoT Sensor Monitoring</h1>
          <p className="text-muted-foreground">Real-time infrastructure monitoring and early warning system.</p>
        </div>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh All
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sensors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,482</div>
            <p className="text-xs text-muted-foreground mt-1">Across 11 regions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">24</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">99.9%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Data Points / Sec</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2k</div>
            <p className="text-xs text-muted-foreground mt-1">Real-time ingestion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockSensors.map((sensor) => (
          <Card key={sensor.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-muted p-2">
                  {getSensorIcon(sensor.sensorType)}
                </div>
                <div>
                  <CardTitle className="text-base">{sensor.locationName}</CardTitle>
                  <CardDescription className="text-xs">{sensor.id}</CardDescription>
                </div>
              </div>
              {getStatusBadge(sensor.status)}
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-end justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Current Reading</p>
                  <p className="text-3xl font-bold">
                    {sensor.lastReading}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Battery: {sensor.batteryLevel}%</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(sensor.lastUpdated).toLocaleTimeString()}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Sensor Type</span>
                  <span className="capitalize">{sensor.sensorType}</span>
                </div>
                <Progress value={sensor.batteryLevel} className="h-1" />
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">View History</Button>
                <Button variant="outline" size="sm" className="flex-1">Configure</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
