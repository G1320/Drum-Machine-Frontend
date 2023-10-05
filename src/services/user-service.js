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

// export const getUserById = async (id) => {
//   try {
//     const res = await httpService.get(`${userEndpoint}/${id}`);
//     return res;
//   } catch (error) {
//     throw error;
//   }
// };

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
