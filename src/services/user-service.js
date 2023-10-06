import { httpService } from './http-service';

const userEndpoint = 'api/users';

export const createUser = async (userData) => {
  try {
    const res = await httpService.post(userEndpoint, userData);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getUserKits = async (userId) => {
  console.log('userId: ', userId);
  try {
    const res = await httpService.get(`${userEndpoint}/my-kits/${userId}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const addKitToUser = async (userId, kitId) => {
  try {
    const res = await httpService.post(`${userEndpoint}/${userId}/add-kit/${kitId}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const removeKitFromUser = async (userId, kitId) => {
  try {
    const res = await httpService.post(`${userEndpoint}/${userId}/remove-kit/${kitId}`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const res = await httpService.get(userEndpoint);
    return res;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, data) => {
  return await httpService.put(`${userEndpoint}/${id}`, data);
};

export const deleteUser = async (id) => {
  try {
    return await httpService.delete(`${userEndpoint}/${id}`);
  } catch (error) {
    throw error;
  }
};

export const getLocalUser = () => {
  const user = sessionStorage.getItem('user');
  if (user) {
    return JSON.parse(user);
  }
  return null;
};
