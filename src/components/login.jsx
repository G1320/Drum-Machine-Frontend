import React, { useState } from 'react';
import Cookies from 'js-cookie';

import { useDispatch } from 'react-redux';
import { login as loginService } from '../services/auth-service';
import { login as loginAction } from '../slices/authSlice';
import { setError } from '../slices/errorSlice';
import { setSuccess } from '../slices/successSlice';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const user = await loginService({ username, password });
      if (!user) return dispatch(setError('Already logged in!'));

      dispatch(loginAction(user));
      dispatch(setSuccess('Login successful!'));
      // sessionStorage.setItem('authToken', data.authToken);
      // Cookies.set('authToken', data.authToken, { expires: 7 });
      // sessionStorage.setItem('user', JSON.stringify(data.user));
      // localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      console.error('Login failed', error);
      dispatch(setError(error?.response?.data || 'Login failed. Please try again.'));
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
