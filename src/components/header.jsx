// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <nav>
        <div className="dropdown">
          <button className="dropbtn">Pages</button>
          <div className="dropdown-content">
            <Link to="/create">Create</Link>
            <Link to="/read">Read</Link>
            <Link to="/update">Update</Link>
            <Link to="/drum">Drum Machine</Link>
            <Link to="/synth">Synth</Link>
            <Link to="/sequencer">Sequencer</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
