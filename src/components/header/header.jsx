import React from 'react';
import '../../assets/styles/components/header/header.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutService } from '../../services/auth-service';
import { logout as logoutAction } from '../../slices/authSlice';

import NavMenu from '../nav-menu/nav-menu';
import { getLocalUser } from '../../services/user-service';

function Header() {
  const dispatch = useDispatch();
  const user = getLocalUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutService();
      dispatch(logoutAction());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <header className="header-container">
      <h1 className="hero">Dyna Drum</h1>
      <NavMenu />

      {user ? (
        <>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <button className="btn-login">
            <Link className="btn-login-link" to="/login">
              Login
            </Link>
          </button>
        </>
      )}
    </header>
  );
}

export default Header;
