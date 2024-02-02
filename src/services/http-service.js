import Axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { refreshAccessToken } from './auth-service';

const BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://drum-machine-backend.onrender.com/api' : '/api';

const axios = Axios.create({
  withCredentials: true,
});

export const httpService = {
  get(endpoint, data) {
    return ajax(endpoint, 'GET', data);
  },
  post(endpoint, data) {
    return ajax(endpoint, 'POST', data);
  },
  put(endpoint, data) {
    return ajax(endpoint, 'PUT', data);
  },
  delete(endpoint, data) {
    return ajax(endpoint, 'DELETE', data);
  },
};

async function ajax(endpoint, method = 'GET', data = null) {
  try {
    let accessToken = Cookies.get('accessToken');

    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);

      if (decodedToken.exp < Date.now() / 1000) {
        //refreshing access token if close to expiry, backend will sign (and return) a new accessToken
        const refreshedToken = await refreshAccessToken();
        if (refreshedToken) {
          accessToken = refreshedToken;
        } else {
          console.error('Failed to refresh token');
          throw new Error('Failed to refresh token');
        }
      }
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }
    //Building the request
    return (
      await axios({ url: `${BASE_URL}${endpoint}`, method, data, params: method === 'GET' && data })
    ).data;
  } catch (err) {
    // Retrying the request if 401 Unauthorized
    if (err.response && err.response.status === 401) {
      try {
        const refreshedToken = await refreshAccessToken();
        if (refreshedToken) return ajax(endpoint, method, data);
      } catch (refreshError) {
        sessionStorage.clear();
        localStorage.clear();
        window.location.assign('/');
      }
    }
    throw err;
  }
}
