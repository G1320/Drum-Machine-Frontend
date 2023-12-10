import React from 'react';
import '../../assets/styles/components/nav-menu/nav-menu.scss';
import { Link, useLocation } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { getLocalUser } from '../../services/user-service';

function NavMenu() {
  const user = getLocalUser();
  const location = useLocation();
  const pathname = location.pathname;
  const pageId = pathname.split('/').pop();

  const isValidObjectId = (id) => {
    return /^[a-f\d]{24}$/i.test(id);
  };

  const validPageId = isValidObjectId(pageId) ? pageId : '6571e750ecffe8969f1e89eb';

  return (
    <div className="nav-menu">
      <Menu left>
        {user && user.isAdmin && (
          <Link to="/read" className="menu-item">
            Users
          </Link>
        )}
        {user && user.isAdmin && (
          <Link to={`/pages/id/${validPageId}`} className="menu-item">
            Edit kit
          </Link>
        )}
        <Link to={`/drum/id/${validPageId}`} className="menu-item">
          Drum Machine
        </Link>
        {user && user.isAdmin && (
          <Link to="/synth" className="menu-item">
            Synth
          </Link>
        )}

        <Link to={`/sequencer/id/${validPageId}`} className="menu-item">
          Sequencer
        </Link>
      </Menu>
    </div>
  );
}

export default NavMenu;
