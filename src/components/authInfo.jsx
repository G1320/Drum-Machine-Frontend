import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserKits } from '../services/kit-service';

function AuthInfo() {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
  const [kits, setKits] = useState([]);

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem('user')));
    if (user) {
      // getUserKits(user.id)
      //   .then((data) => setKits(data))
      //   .catch((error) => console.log(error));
    }
  }, [user]);

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

export default AuthInfo;
