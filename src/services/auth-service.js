import { httpService } from './http-service';
import Cookies from 'js-cookie';

const authEndpoint = 'api/auth';

// export const getUserDetails = async () => {
//   try {
//     const response = await httpService.get(`${authEndpoint}/me`);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to get user details:', error);
//     throw error;
//   }
// };

export const register = async (userData) => {
  try {
    const { authToken, user } = await httpService.post(`${authEndpoint}/register`, userData);
    sessionStorage.setItem('user', JSON.stringify(user));
    Cookies.set('authToken', authToken, { expires: 7 });
    return user;
  } catch (error) {
    console.error('Registration failed', error);
    if (error.response && error.response.status === 400) {
      throw new Error(
        'A user with that email or username already exists. Please choose a different email or username.'
      );
    }
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const { user, authToken } = await httpService.post(`${authEndpoint}/login`, credentials);
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
      Cookies.set('authToken', authToken, { expires: 7 });
      return user;
    }
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await httpService.post(`${authEndpoint}/logout`);
    sessionStorage.removeItem('user');
    Cookies.remove('authToken');
  } catch (error) {
    console.error('Logout failed', error);
    throw error;
  }
};
