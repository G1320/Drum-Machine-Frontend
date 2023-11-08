import React from 'react';
import '../../assets/styles/components/kits/user-kits-list.css';
import { useSelector, useDispatch } from 'react-redux';
import { removeKitFromUser, getUserKits } from '../../services/user-service';
import { useNavigate } from 'react-router-dom';

import UserKitDetails from './user-kit-details';

function UserKitsList() {
  const userKits = useSelector((state) => state.kits.userKits);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const handleRemoveKit = async (kitId) => {
    try {
      await removeKitFromUser(user._id, kitId);
      dispatch({ type: 'userKits/removeKit', payload: kitId });
      const returnedUserKits = await getUserKits(user._id);
      dispatch({ type: 'userKits/setUserKits', payload: returnedUserKits });
    } catch (error) {
      dispatch(setError('Failed to remove kit. Please try again later.'));
    }
  };

  const handleSelectKit = (kitId) => {
    navigate(`/drum/id/${kitId}`);
  };

  return (
    <section className="user-kits">
      {userKits.map((userKit) => (
        <UserKitDetails
          key={userKit._id}
          userKit={userKit}
          onRemoveKit={() => handleRemoveKit(userKit._id)}
          onSelectKit={() => handleSelectKit(userKit._id)}
        />
      ))}
    </section>
  );
}

export default UserKitsList;
