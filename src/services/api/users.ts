import { User } from '../../types';
import { mockUsers } from '../mock';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUsers = async (currentUser?: User | null): Promise<User[]> => {
  console.log('GET /api/users', currentUser?.role);
  await delay(800);
  
  if (!currentUser) return [];
  
  if (currentUser.role === 'federal_admin') {
    return [...mockUsers];
  }
  
  if (currentUser.role === 'regional_admin') {
    return mockUsers.filter(user => user.region === currentUser.region);
  }
  
  return []; // Other roles shouldn't see user list
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  console.log(`GET /api/users/${id}`);
  await delay(500);
  return mockUsers.find((user) => user.id === id);
};

export const createUser = async (data: Omit<User, 'id'>): Promise<User> => {
  console.log('POST /api/users', data);
  await delay(1000);
  const newUser: User = {
    ...data,
    id: `U${(mockUsers.length + 1).toString()}`,
  };
  mockUsers.push(newUser);
  return newUser;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  console.log(`PUT /api/users/${id}`, data);
  await delay(800);
  const index = mockUsers.findIndex((user) => user.id === id);
  if (index === -1) throw new Error('User not found');
  
  const updatedUser = {
    ...mockUsers[index],
    ...data,
  };
  mockUsers[index] = updatedUser;
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<void> => {
  console.log(`DELETE /api/users/${id}`);
  await delay(600);
  const index = mockUsers.findIndex((user) => user.id === id);
  if (index !== -1) {
    mockUsers.splice(index, 1);
  }
};
