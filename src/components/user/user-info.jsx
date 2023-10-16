import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../assets/styles/components/user/user-info.css';
import { getUserKits, getLocalUser, removeKitFromUser } from '../../services/user-service';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';
import { Select, MenuItem } from '@mui/material';

function UserInfo() {
  const userKits = useSelector((state) => state.kits.userKits);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

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
      })
      .catch((error) => {
        dispatch(setError('Failed to remove kit. Please try again later.'));
      });
  };

  const [selectedKit, setSelectedKit] = useState('');

  const handleChange = (event) => {
    setSelectedKit(event.target.value);
  };

  if (user) {
    return (
      <div className="user-info">
        <span>Welcome, {user.username}</span>
        {userKits && userKits.length > 0 && (
          <div className="user-kits">
            <p>My kits:</p>
            <Select value={selectedKit} onChange={handleChange} displayEmpty>
              <MenuItem className="select-kit" value="" disabled>
                Select a kit
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
            {selectedKit && (
              <button
                onClick={() => handleRemoveKit(userKits.find((kit) => kit.name === selectedKit)._id)}
              >
                X
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default UserInfo;
