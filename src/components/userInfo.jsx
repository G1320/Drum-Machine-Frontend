import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserKits } from '../services/kit-service';
import { getLocalUser } from '../services/user-service';

function UserInfo() {
  const [user, setUser] = useState(null);
  const [kits, setKits] = useState([]);

  useEffect(() => {
    const localUser = getLocalUser();
    if (!localUser) return;

    setUser(localUser);
    getUserKits(localUser._id).then((userKits) => {
      setKits(userKits);
    });
  }, []);

  if (user) {
    return (
      <div>
        <span>Welcome, {user.username}</span>
        {kits && kits.length > 0 && (
          <ul>
            <p>my kits:</p>
            {kits.map((kit, index) => (
              <li key={index}>{kit.name}</li>
            ))}
          </ul>
        )}
      </div>
    );
  } else {
    return <Link to="/login">Login</Link>;
  }
}

export default UserInfo;
