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
        <Link to="/create-kit">Create Kit</Link>

        {user && (
          <Link to={`/pages/id/${validKitId}`} className="menu-item">
            Edit kit
          </Link>
        )}
        <Link to={`/drum/id/${validKitId}`} className="menu-item">
          Drum Machine
        </Link>

        <Link to={`/sequencer/id/${validKitId}`} className="menu-item">
          Sequencer
        </Link>
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
      </Menu>
    </div>
  );
}

export default NavMenu;
