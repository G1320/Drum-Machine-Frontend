import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';
import StartMicrophoneAccess from './start-mic-access';
import KitDropdown from '../components/kit-dropdown';
import AuthInfo from './authInfo';

function Header() {
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
      <AuthInfo /> {/* Rendering the AuthInfo component */}
    </header>
  );
}

export default Header;
