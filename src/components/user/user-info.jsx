import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import '../../assets/styles/components/user/user-info.css';
import { getUserKits, getLocalUser, removeKitFromUser } from '../../services/user-service';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';
import { Select, MenuItem } from '@mui/material';

function UserInfo() {
  const selectedKit = useSelector((state) => state.selectedKit || '');
  const userKits = useSelector((state) => state.kits.userKits);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const localUser = getLocalUser();
      dispatch({ type: 'auth/login', payload: localUser });
    }

    if (user) {
      getUserKits(user._id).then((returnedUserKits) => {
        dispatch({ type: 'userKits/setUserKits', payload: returnedUserKits });
      });
    }
  }, [user, dispatch]);

  const handleRemoveKit = (kitId) => {
    removeKitFromUser(user._id, kitId)
      .then(() => {
        dispatch({ type: 'userKits/removeKit', payload: kitId });
        dispatch(setSuccess('Kit removed successfully!'));
        getUserKits(user._id).then((returnedUserKits) => {
          dispatch({ type: 'userKits/setUserKits', payload: returnedUserKits });
        });
      })
      .catch((error) => {
        dispatch(setError('Failed to remove kit. Please try again later.'));
      });
  };

  const handleChange = (event) => {
    const selectedKit = userKits.find((kit) => kit.name === event.target.value);
    if (selectedKit) {
      navigate(`/drum/id/${selectedKit._id}`);
    }
  };

  if (user) {
    return (
      <div className="user-info">
        <span>Hey {user.username}</span>
        {userKits && userKits.length > 0 && (
          <div className="user-kits">
            <Select value={selectedKit} onChange={handleChange} displayEmpty>
              <MenuItem className="select-kit" value="" disabled>
                My kits:
              </MenuItem>
              {userKits.map((userKit, index) => (
                <MenuItem key={index} value={userKit.name}>
                  {userKit.name}
                  <button className="remove-kit-button" onClick={() => handleRemoveKit(userKit._id)}>
                    X
                  </button>
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
      </div>
    );
  }
}

export default UserInfo;
