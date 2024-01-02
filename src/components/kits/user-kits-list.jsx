import React, { useEffect, useRef } from 'react';
import '../../assets/styles/components/kits/user-kits-list.scss';
import { useSelector, useDispatch } from 'react-redux';
import { removeKitFromUser, getUserKits } from '../../services/user-service';
import { useNavigate, useLocation } from 'react-router-dom';
import { setError } from '../../slices/errorSlice';
import { removeUserKit, setSelectedKit, setUserKits, removeCombinedKit } from '../../slices/kitsSlice';
import { clearSelectedCells } from '../../slices/selectedCellsSlice';

import UserKitDetails from './user-kit-details';

function UserKitsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);
  const userKits = useSelector((state) => state.kits.combinedKits);
  const selectedKit = useSelector((state) => state.kits.selectedKit);
  const selectedKitRef = useRef(null);

  useEffect(() => {
    if (selectedKitRef.current) {
      selectedKitRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedKit]);
  const handleRemoveKit = async (kitId) => {
    try {
      const kit = await removeKitFromUser(user._id, kitId);
      dispatch(removeUserKit(kit));
      dispatch(removeCombinedKit(kit));
      const updatedUserKits = await getUserKits(user._id);
      dispatch(setUserKits(updatedUserKits));
    } catch (error) {
      dispatch(setError(error?.response?.data || 'Failed to remove kit from user'));
    }
  };

  const handleSelectKit = (kitId) => {
    const kit = userKits.find((userKit) => userKit._id === kitId);
    dispatch(setSelectedKit(kit));
    dispatch(clearSelectedCells());
    handleNavigateToSelectedKit(kitId);
  };

  const handleNavigateToSelectedKit = (kitId) => {
    const locationPath = location.pathname.split('/')[1];
    if (locationPath === 'drum') {
      navigate(`/drum/id/${kitId}`);
    } else if (locationPath === 'sequencer') {
      navigate(`/sequencer/id/${kitId}`);
    }
  };

  return (
    <section className="user-kits">
      {userKits.map((userKit) => (
        <UserKitDetails
          ref={userKit._id === selectedKit._id ? selectedKitRef : null}
          selectedKit={selectedKit}
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
