import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutService } from '../services/auth-service';
import { logout as logoutAction } from '../slices/authSlice';

import '../styles/header.css';
import StartMicrophoneAccess from './start-mic-access';
import KitDropdown from '../components/kit-dropdown';
import AuthInfo from './authInfo';

function Header() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logoutService();
      dispatch(logoutAction());
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  return (
    <header>
      <h1>Drum Machine App</h1>
      <StartMicrophoneAccess />
      <nav>
        <div className="dropdown">
          <button className="dropbtn">Pages</button>
          <div className="dropdown-content">
            <Link to="/create">Create user</Link>
            <Link to="/read">Users</Link>
            <Link to="/update">Update user</Link>
            <Link to="/pages/id/64e61e8b7aecdc67f8632329">kits</Link>
            <Link to="/drum">Drum Machine</Link>
            <Link to="/synth">Synth</Link>
            <Link to="/sequencer">Sequencer</Link>
          </div>
        </div>
      </nav>
      <KitDropdown />
      <AuthInfo />
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}

export default Header;
