import { httpService } from './http-service';
import Cookies from 'js-cookie';

const authEndpoint = '/auth';

export const register = async (userData) => {
  try {
    const { accessToken, user } = await httpService.post(`${authEndpoint}/register`, userData);
    localStorage.setItem('user', JSON.stringify(user));
    Cookies.set('accessToken', accessToken, { expires: 1 / 96 });
    return user;
  } catch (error) {
    console.error('Registration failed', error);
    if (error.response && error.response.status === 400) {
      throw new Error('A user with that email or username already exists.');
    }
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const { user, accessToken } = await httpService.post(`${authEndpoint}/login`, credentials);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      Cookies.set('accessToken', accessToken, { expires: 1 / 96 });
      return user;
    }
  } catch (error) {
    console.error('Login failed', error);
    throw new Error('Login failed');
  }
};

export const refreshAccessToken = async () => {
  try {
    const { accessToken } = await httpService.post(`${authEndpoint}/refresh-token`);
    Cookies.set('accessToken', accessToken, { expires: 1 / 96 });
    return { accessToken };
  } catch (error) {
    console.error('Refresh token failed', error);
    throw new Error('Refresh token failed');
  }
};

export const logout = async () => {
  try {
    await httpService.post(`${authEndpoint}/logout`);
    localStorage.removeItem('user');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  } catch (error) {
    console.error('Logout failed', error);
    throw new Error('Logout failed');
  }
};
