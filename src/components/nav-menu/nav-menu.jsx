import React from 'react';
import { Link } from 'react-router-dom';
import '../../assets/styles/components/nav-menu/nav-menu.css';
import { slide as Menu } from 'react-burger-menu';

function NavMenu() {
  return (
    <div className="nav-menu">
      <Menu left>
        <Link to="/read" className="menu-item">
          Users
        </Link>
        <Link to="/pages/id/64e61e8b7aecdc67f8632329" className="menu-item">
          Kits
        </Link>
        <Link to="/drum" className="menu-item">
          Drum Machine
        </Link>
        <Link to="/synth" className="menu-item">
          Synth
        </Link>
        <Link to="/sequencer" className="menu-item">
          Sequencer
        </Link>
      </Menu>
    </div>
  );
}

export default NavMenu;
