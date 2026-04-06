import { User } from '../../types';
import { AdminRepository } from '../../repositories';

const USE_MOCK = false;

export const getUsers = async (currentUser?: User | null): Promise<User[]> => {
  if (USE_MOCK) {
    // return usersApi.getUsers(currentUser);
  }
  return AdminRepository.getTechnicians();
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  if (USE_MOCK) {
    // return usersApi.getUserById(id);
  }
  // No specific getUserById in AdminRepository, but we can filter getTechnicians or use a generic endpoint
  const technicians = await AdminRepository.getTechnicians();
  return technicians.find(t => t.id === id);
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  if (USE_MOCK) {
    // return usersApi.createUser(user);
  }
  // No specific createUser in AdminRepository, but we can use AuthRepository.signupEmployee
  return {} as User;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  if (USE_MOCK) {
    // return usersApi.updateUser(id, user);
  }
  return {} as User;
};
