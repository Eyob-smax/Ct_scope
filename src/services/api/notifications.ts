import { Notification } from '../../types';
import { mockNotifications } from '../mock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getNotifications = async (): Promise<Notification[]> => {
  console.log('GET /api/notifications');
  await delay(600);
  return [...mockNotifications];
};

export const markAsRead = async (id: string): Promise<Notification> => {
  console.log(`PUT /api/notifications/${id}/read`);
  await delay(300);
  const index = mockNotifications.findIndex((n) => n.id === id);
  if (index === -1) throw new Error('Notification not found');
  
  const updatedNotification = {
    ...mockNotifications[index],
    read: true,
  };
  mockNotifications[index] = updatedNotification;
  return updatedNotification;
};

export const markAllAsRead = async (): Promise<void> => {
  console.log('PUT /api/notifications/read-all');
  await delay(800);
  mockNotifications.forEach((n) => {
    n.read = true;
  });
};

export const deleteNotification = async (id: string): Promise<void> => {
  console.log(`DELETE /api/notifications/${id}`);
  await delay(400);
  const index = mockNotifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    mockNotifications.splice(index, 1);
  }
};
