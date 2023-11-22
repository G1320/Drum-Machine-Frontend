import React, { useState } from 'react';
import '../../assets/styles/components/auth/login.scss';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { login as loginService } from '../../services/auth-service';
import { login as loginAction } from '../../slices/authSlice';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const user = await loginService({ username, password });
      if (!user) return;
      dispatch(loginAction(user));
      dispatch(setSuccess('Login successful!'));
      navigate('/drum/id/64e61e8b7aecdc67f863233c');
    } catch (error) {
      console.error('Login failed', error);
      dispatch(setError(error?.response?.data || 'Login failed. Please try again.'));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };
  return (
    <section className="login">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button onClick={handleLogin}>Login</button>
      <button>
        <Link to="/create">Create user</Link>
      </button>
    </section>
  );
}

export default Login;
