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
  get: (endpoint, data) => ajax(endpoint, 'GET', data),
  post: (endpoint, data) => ajax(endpoint, 'POST', data),
  put: (endpoint, data) => ajax(endpoint, 'PUT', data),
  delete: (endpoint, data) => ajax(endpoint, 'DELETE', data),
};

async function ajax(endpoint, method = 'GET', data = null) {
  // debugger;
  try {
    const accessToken = await getAccessToken();
    console.log('document.cookie:', document.cookie);
    setAuthorizationHeader(accessToken);

    // Building the request and returning the response data
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
        console.error('Failed to refresh token', refreshError);
        throw refreshError;
        // sessionStorage.clear();
        // localStorage.clear();
        // window.location.assign('/');
      }
    }
    throw err;
  }
}

async function getAccessToken() {
  let accessToken = Cookies.get('accessToken');
  if (!accessToken) return null;

  const decodedToken = jwtDecode(accessToken);
  if (decodedToken.exp < Date.now() / 1000) {
    try {
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        accessToken = refreshedToken;
      } else {
        console.error('Failed to refresh token');
        throw new Error('Failed to refresh token');
      }
    } catch (refreshError) {
      console.error('Failed to refresh token', refreshError);
      sessionStorage.clear();
      localStorage.clear();
      // window.location.assign('/');
    }
  }
  return accessToken;
}

function setAuthorizationHeader(accessToken) {
  if (accessToken) {
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  }
}
