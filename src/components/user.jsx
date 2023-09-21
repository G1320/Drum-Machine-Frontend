import React from 'react';
import { useSelector } from 'react-redux';

function User() {
  const user = useSelector((state) => state.auth.user); // Adjust the path according to your Redux store structure

  return <div>{user ? <h2>Welcome, {user.username}</h2> : <h2>You are not logged in</h2>}</div>;
}

export default User;
