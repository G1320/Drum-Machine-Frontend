import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import '../../assets/styles/components/nav-menu/nav-menu.css';

function NavMenu() {
  const location = useLocation();
  const pathname = location.pathname;
  const pageId = pathname.split('/').pop();

  const isValidObjectId = (id) => {
    return /^[a-f\d]{24}$/i.test(id);
  };

  const validPageId = isValidObjectId(pageId) ? pageId : '64e61e8b7aecdc67f8632329';

  return (
    <div className="nav-menu">
      <Menu left>
        <Link to="/read" className="menu-item">
          Users
        </Link>
        <Link to={`/pages/id/${validPageId}`} className="menu-item">
          Edit kit
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
