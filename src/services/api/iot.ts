import { IoTSensor } from '../../types';
import { mockSensors } from '../mock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getSensors = async (): Promise<IoTSensor[]> => {
  console.log('GET /api/iot/sensors');
  await delay(800);
  return [...mockSensors];
};

export const getSensorById = async (id: string): Promise<IoTSensor | undefined> => {
  console.log(`GET /api/iot/sensors/${id}`);
  await delay(500);
  return mockSensors.find((sensor) => sensor.id === id);
};

export const updateSensorStatus = async (id: string, status: IoTSensor['status']): Promise<IoTSensor> => {
  console.log(`PUT /api/iot/sensors/${id}/status`, { status });
  await delay(800);
  const index = mockSensors.findIndex((sensor) => sensor.id === id);
  if (index === -1) throw new Error('Sensor not found');
  
  const updatedSensor = {
    ...mockSensors[index],
    status,
    lastUpdated: new Date().toISOString(),
  };
  mockSensors[index] = updatedSensor;
  return updatedSensor;
};

export const getSensorReadings = async (id: string, range: string = '24h'): Promise<any[]> => {
  console.log(`GET /api/iot/sensors/${id}/readings?range=${range}`);
  await delay(1000);
  return [
    { timestamp: '2024-03-20T10:00:00Z', value: 45.2 },
    { timestamp: '2024-03-20T10:15:00Z', value: 45.5 },
    { timestamp: '2024-03-20T10:30:00Z', value: 45.8 },
    { timestamp: '2024-03-20T10:45:00Z', value: 45.6 },
    { timestamp: '2024-03-20T11:00:00Z', value: 45.5 },
  ];
};
