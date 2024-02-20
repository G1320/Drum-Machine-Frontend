import React from 'react';
import '../../assets/styles/components/nav-menu/nav-menu.scss';
import { Link, useLocation } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import { getLocalUser } from '../../services/user-service';

function NavMenu() {
  const user = getLocalUser();
  const location = useLocation();
  const pathname = location.pathname;
  const kitId = pathname.split('/').pop();

  const isValidObjectId = (id) => {
    return /^[a-f\d]{24}$/i.test(id);
  };

  const validKitId = isValidObjectId(kitId) ? kitId : '6571e750ecffe8969f1e89ee';

  return (
    <div className="nav-menu">
      <Menu left>
        <Link to={`/sequencer/id/${validKitId}`} className="menu-item">
          Sequencer
        </Link>

        {user && <Link to="/create-kit">Create A Kit</Link>}
        {user && user.isAdmin && (
          <Link to={`/pages/id/${validKitId}`} className="menu-item">
            Edit kit
          </Link>
        )}

        {user && user.isAdmin && (
          <Link to={`/drum/id/${validKitId}`} className="menu-item">
            Drum Machine
          </Link>
        )}

        {user && user.isAdmin && (
          <Link to="/synth" className="menu-item">
            Synth
          </Link>
        )}
        {user && user.isAdmin && (
          <Link to="/read" className="menu-item">
            Browse Users
          </Link>
        )}
        <Link to={'/help'} className="menu-item">
          How To
        </Link>
        <Link to={`/about`} className="menu-item">
          About
        </Link>
      </Menu>
    </div>
  );
}

export default NavMenu;
