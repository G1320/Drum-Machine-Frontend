import React, { useState } from 'react';
import Cookies from 'js-cookie';

import { useDispatch } from 'react-redux';
import { login as loginService } from '../services/auth-service'; // Import the login service with an alias
import { login as loginAction } from '../slices/authSlice'; // Import the login action with an alias
import { setError } from '../slices/errorSlice'; // Import the setError action
import { setSuccess } from '../slices/successSlice'; // Import the setError action

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const data = await loginService({ username, password });
      dispatch(loginAction({ username }));
      dispatch(setSuccess('Login successful!'));
      Cookies.set('token', data.token, { expires: 7 }); // Token expires in 7 days
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
