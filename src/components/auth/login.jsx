import React, { useState } from 'react';
import '../../assets/styles/components/auth/login.scss';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { login as loginService } from '../../services/auth-service';
import { login as loginAction } from '../../slices/authSlice';
import { setError } from '../../slices/errorSlice';
import useCustomStorage from '../../hooks/useCustomStorage';
// import { useStorage } from '@capacitor-community/storage-react';

// import { createStorageService } from '../../services/storage-service';

function Login() {
  // const userStorageService = createStorageService('user', null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [user, setUser] = useStorage('user');

  // const [user, setUser, clearUser] = useCustomStorage('user', null);
  const handleLogin = async () => {
    try {
      const loggedInUser = await loginService({ username, password });
      if (!loggedInUser) return;

      dispatch(loginAction(loggedInUser));
      // setUser(loggedInUser);
      navigate('/sequencer/id/6571e750ecffe8969f1e89eb');
    } catch (error) {
      console.error('Login failed', error);
      dispatch(setError(error?.response?.data || 'Login failed. Please try again.'));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') handleLogin();
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
