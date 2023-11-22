import React from 'react';
import '../../assets/styles/components/drum-machine/drum-machine-options.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getLocalUser } from '../../services/user-service';
import { addKitToUser, getUserKits } from '../../services/user-service';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';

const DrumMachineOptions = ({ kitId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToKits = async () => {
    const user = getLocalUser();
    if (user) {
      try {
        await addKitToUser(user._id, kitId);
        const userKits = await getUserKits(user._id);
        dispatch({ type: 'userKits/setUserKits', payload: userKits });
        dispatch(setSuccess('Kit added to your kits!'));
      } catch (error) {
        console.error('Failed to add kit to user', error);
        dispatch(setError(error?.response?.data || 'Failed to add kit to user'));
      }
    } else {
      dispatch(setError('Please log in to add a Kit to your Kits!'));
    }
  };

  const handleNavigateToEdit = () => {
    navigate(`/pages/id/${kitId}`);
  };

  const handleLoadSequencer = () => {
    navigate(`/sequencer/id/${kitId}`);
  };

  return (
    <section className="drum-machine-options">
      <button className="edit-btn" variant="contained" onClick={handleNavigateToEdit}>
        Edit kit
      </button>
      <button
        className="add-to-kits-btn"
        variant="contained"
        color="secondary"
        onClick={handleAddToKits}
      >
        Add to my kits
      </button>
      <button className="load-sequencer-btn" variant="contained" onClick={handleLoadSequencer}>
        Load Sequencer
      </button>
    </section>
  );
};

export default DrumMachineOptions;
