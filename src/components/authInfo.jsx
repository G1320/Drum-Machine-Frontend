import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function AuthInfo() {
  const user = useSelector((state) => state.auth.user);

  if (user) {
    return <span>Welcome, {user.username}</span>;
  } else {
    return <Link to="/login">Login</Link>;
  }
}

export default AuthInfo;
