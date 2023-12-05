import Axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : '//localhost:3000/api';
// const BASE_URL = '//localhost:3000/api';

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
    const accessToken = Cookies.get('authToken');
    if (accessToken) {
      const decodedToken = jwt.decode(accessToken);
      if (decodedToken.exp < Date.now() / 1000) {
        //if Access token has expired, refresh it using the refresh token
        const refreshToken = Cookies.get('refreshToken');
        const response = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
        const newAccessToken = response.data.authToken;
        localStorage.setItem('authToken', newAccessToken);
        axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
      } else {
        // Access token is still valid, use it
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      }
    }
    const res = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      data,
      params: method === 'GET' ? data : null,
    });
    return res.data;
  } catch (err) {
    console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data:`, data);
    console.dir(err);
    if (err.response && err.response.status === 401) {
      sessionStorage.clear();
      window.location.assign('/');
      // Depends on routing strategy - hash or history
      // window.location.assign('/#/login')
      // window.location.assign('/login')
      // router.push('/login')
    }
    throw err;
  }
}
