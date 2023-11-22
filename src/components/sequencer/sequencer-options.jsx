import React from 'react';
import '../../assets/styles/components/sequencer/sequencer-options.scss';
import { useDispatch } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
import { setSuccess } from '../../slices/successSlice';
import { setError } from '../../slices/errorSlice';
import { getUserKits, addKitToUser } from '../../services/user-service';

import { getLocalUser } from '../../services/user-service';

import { getKitById } from '../../services/kit-service';
import FilterKits from '../kits/filter-kits';

const sequencerOptions = ({ numOfSteps, handleNumOfStepsChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { kitId } = useParams();

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

  const handleNextKit = async () => {
    try {
      const { nextKit } = await getKitById(kitId);
      if (nextKit) navigate(`/sequencer/id/${nextKit._id}`);
    } catch (error) {
      console.error('Failed to load next kit', error);
    }
  };

  const handlePrevKit = async () => {
    try {
      const { prevKit } = await getKitById(kitId);
      if (prevKit) navigate(`/sequencer/id/${prevKit._id}`);
    } catch (error) {
      console.error('Failed to load previous kit', error);
    }
  };
  const handleLoadDrumMachine = () => {
    navigate(`/drum/id/${kitId}`);
  };

  const handleBpmChange = (e) => {
    Tone.Transport.bpm.value = Number(e.target.value);
  };

  const handleVolumeChange = (e) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  return (
    <section className="sequencer-options">
      <section className="options-wrapper">
        <article className="step-length-wrapper">
          <label>
            <input
              type="radio"
              value="16"
              checked={numOfSteps === 16}
              onChange={handleNumOfStepsChange}
            />
            16
          </label>
          <label>
            <input
              type="radio"
              value="32"
              checked={numOfSteps === 32}
              onChange={handleNumOfStepsChange}
            />
            32
          </label>
        </article>
        <button
          className="add-to-kits-btn"
          variant="contained"
          color="secondary"
          onClick={handleAddToKits}
        >
          Add to my kits
        </button>
        <button className="load-drum-machine-btn" variant="contained" onClick={handleLoadDrumMachine}>
          Pads
        </button>
        <div className="pagination-controls-wrapper">
          <button className="prev-kit-btn" onClick={handlePrevKit}>
            Prev
          </button>
          <button className="next-kit-btn" onClick={handleNextKit}>
            Next
          </button>
        </div>
        <FilterKits />
      </section>
      <section className="range-controls">
        <article className="bpm">
          <span>BPM</span>
          <label className="bpm-label"></label>
          <input
            type="range"
            min={20}
            max={220}
            step={1}
            onChange={handleBpmChange}
            defaultValue={120}
          />
        </article>
        <article className="volume">
          <span>VOL</span>
          <label className="volume-label"></label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
            defaultValue={0.5}
          />
        </article>
      </section>
    </section>
  );
};

export default sequencerOptions;
