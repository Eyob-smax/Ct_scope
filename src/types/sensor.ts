export type SensorType = 'water' | 'vibration' | 'electricity' | 'flood';

export interface IoTSensor {
  id: string;
  sensorType: SensorType;
  locationName: string;
  latitude: number;
  longitude: number;
  status: 'online' | 'offline';
  lastReading: number;
  batteryLevel: number;
  lastUpdated: string;
}
