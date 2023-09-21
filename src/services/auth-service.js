import { httpService } from './http-service';

export const register = async (userData) => {
  try {
    return await httpService.post('api/auth/register', userData);
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    return await httpService.post('api/auth/login', credentials);
  } catch (error) {
    throw error;
  }
};

export const fetchUserDetails = async (token) => {
  try {
    return await httpService.get('api/auth/me', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Failed to fetch user details', error);
    throw error;
  }
};
