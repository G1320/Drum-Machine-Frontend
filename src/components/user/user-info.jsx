import '../../assets/styles/components/user/user-info.css';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getUserKits, getLocalUser, removeKitFromUser } from '../../services/user-service';
import { setError } from '../../slices/errorSlice';

import UserKitsList from '../kits/user-kits-list';

function UserInfo() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    try {
      if (!user) {
        const localUser = getLocalUser();
        dispatch({ type: 'auth/login', payload: localUser });
      }

      if (user) {
        getUserKits(user._id).then((returnedUserKits) => {
          dispatch({ type: 'userKits/setUserKits', payload: returnedUserKits });
        });
      }
    } catch (error) {
      dispatch(setError(error?.response?.data || 'Something went wrong!'));
      console.error('Failed to load user kits', error);
    }
  }, [user, dispatch]);

  if (user) {
    return (
      <section className="user-info">
        <UserKitsList />
      </section>
    );
  }
}

export default UserInfo;
