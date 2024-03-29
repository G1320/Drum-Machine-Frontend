import React from 'react';
import '../../assets/styles/components/header/header.scss';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutService } from '../../services/auth-service';
import { logout as logoutAction } from '../../slices/authSlice';

import NavMenu from '../nav-menu/nav-menu';

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { kitId } = useParams();

  const handleLogout = async () => {
    try {
      await logoutService();
      dispatch(logoutAction());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleHeaderClick = () => {
    kitId ? navigate(`/sequencer/id/${kitId}`) : navigate('/');
  };

  return (
    <header className="header-container">
      <NavMenu />
      <h1 onClick={handleHeaderClick} className="hero">
        Dyna Drum
      </h1>

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
