import React, { useEffect, useState } from 'react';
import '../../assets/styles/components/drum-machine/drum-machine-options.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { getLocalUser } from '../../services/user-service';
// import { addKitToUser, getUserKits } from '../../services/user-service';
// import { getKitById } from '../../services/kit-service';
// import { setError } from '../../slices/errorSlice';
// import { setSuccess } from '../../slices/successSlice';
import FilterKits from '../kits/filter-kits';
import { setSelectedKit } from '../../slices/kitsSlice';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const DrumMachineOptions = ({ kitId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const selectedKit = useSelector((state) => state.kits.selectedKit);
  const combinedKits = useSelector((state) => state.kits.combinedKits);

  // const handleAddToKits = async () => {
  //   const user = getLocalUser();
  //   if (user) {
  //     try {
  //       await addKitToUser(user._id, kitId);
  //       const userKits = await getUserKits(user._id);
  //       dispatch({ type: 'userKits/setUserKits', payload: userKits });
  //       dispatch(setSuccess('Kit added to your kits!'));
  //     } catch (error) {
  //       console.error('Failed to add kit to user', error);
  //       dispatch(setError(error?.response?.data || 'Failed to add kit to user'));
  //     }
  //   } else {
  //     dispatch(setError('Please log in to add a Kit to your Kits!'));
  //   }
  // };

  useEffect(() => {
    // Update the currentIndex when the selectedKit changes
    const index = combinedKits.findIndex((kit) => kit._id === selectedKit._id);
    setCurrentIndex(index);
  }, [combinedKits, selectedKit]);

  const handleNextKit = async () => {
    const nextIndex = currentIndex === combinedKits.length - 1 ? 0 : currentIndex + 1;
    const nextKit = combinedKits[nextIndex];
    dispatch(setSelectedKit(nextKit));
    setCurrentIndex(nextIndex);
    navigate(`/drum/id/${nextKit._id}`);
  };

  const handlePrevKit = async () => {
    const prevIndex = currentIndex === 0 ? combinedKits.length - 1 : currentIndex - 1;
    const prevKit = combinedKits[prevIndex];
    dispatch(setSelectedKit(prevKit));
    setCurrentIndex(prevIndex);
    navigate(`/drum/id/${prevKit._id}`);
  };

  const handleNavigateToEdit = () => {
    navigate(`/pages/id/${kitId}`);
  };

  const handleLoadSequencer = () => {
    navigate(`/sequencer/id/${kitId}`);
  };

  return (
    <section className="drum-machine-options">
      {/* <button className="edit-btn" variant="contained" onClick={handleNavigateToEdit}>
        Edit kit
      </button> */}
      {/* <button
        className="add-to-kits-btn"
        variant="contained"
        color="secondary"
        onClick={handleAddToKits}
      >
        Add to my kits
      </button> */}
      {/* <button className="load-sequencer-btn" variant="contained" onClick={handleLoadSequencer}>
        SEQ
      </button> */}
      <section className="pagination-controls-wrapper">
        <button className="prev-button" onClick={handlePrevKit}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button className="next-button" onClick={handleNextKit}>
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </section>
      <FilterKits />
    </section>
  );
};

export default DrumMachineOptions;
