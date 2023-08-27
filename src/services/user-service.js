import axios from 'axios';

const baseURL = 'http://localhost:3000/api/users';

export const createUser = async (userData) => {
  try {
    const res = await axios.post(baseURL, userData);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const res = await axios.get(baseURL);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (id, data) => {
  return await axios.put(`${baseURL}/${id}`, data);
};

export const deleteUser = async (id) => {
  try {
    return await axios.delete(`${baseURL}/${id}`);
  } catch (error) {
    throw error;
  }
};
