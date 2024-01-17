import { httpService } from './http-service';

const userEndpoint = '/users';

export const getLocalUser = () => {
  const user = sessionStorage.getItem('user');

  if (user) return JSON.parse(user);

  return null;
};

export const createUser = async (userData) => {
  try {
    return await httpService.post(userEndpoint, userData);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserKits = async (userId) => {
  try {
    return await httpService.get(`${userEndpoint}/my-kits/${userId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addKitToUser = async (userId, kitId) => {
  try {
    return await httpService.post(`${userEndpoint}/${userId}/add-kit/${kitId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeKitFromUser = async (userId, kitId) => {
  try {
    return await httpService.post(`${userEndpoint}/${userId}/remove-kit/${kitId}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    return await httpService.get(userEndpoint);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    return await httpService.put(`${userEndpoint}/${id}`, data);
  } catch (error) {
    console.error('Failed to update user', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    return await httpService.delete(`${userEndpoint}/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
