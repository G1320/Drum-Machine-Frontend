import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/sequencer/sequencer-options.scss';
import * as Tone from 'tone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FilterKits from '../kits/filter-kits';
import UserSongsList from '../songs/user-songs-list';
import { setSelectedKit } from '../../slices/kitsSlice';
import {
  setTempo,
  setVolume,
  setReverb,
  setDelay,
  setSwing,
  setNumOfSteps,
  clearSequencerState,
  setSongId,
} from '../../slices/sequencerSlice';
import {
  clearLocalSequencerState,
  setLocalPattern,
  setLocalTempo,
  setLocalVolume,
  setLocalReverb,
  setLocalDelay,
  setLocalSwing,
  setLocalNumOfSteps,
  setLocalMutedTracks,
  getLocalNumOfStepsPrePortrait,
  setLocalNumOfStepsPrePortrait,
} from '../../services/sequencer-service';
import { getLoopedIndex } from '../../utils/getLoopedIndex';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const sequencerOptions = ({ sequencerState }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const combinedKits = useSelector((state) => state.kits.combinedKits);
  const selectedKit = useSelector((state) => state.kits.selectedKit);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Updating the currentIndex when the selectedKit changes
    const index = combinedKits.findIndex((kit) => kit._id === selectedKit._id);
    setCurrentIndex(index);
  }, [combinedKits, selectedKit]);

  const handleNextKit = () => handleKitChange('next');
  const handlePrevKit = () => handleKitChange('prev');

  const handleKitChange = (direction) => {
    if (isLoading) return;
    setIsLoading(true);
    const newIndex = getLoopedIndex(currentIndex, combinedKits.length, direction);
    const newKit = combinedKits[newIndex];

    setLocalPattern(sequencerState.pattern);
    setLocalMutedTracks([]);
    dispatch(setSelectedKit(newKit));
    setCurrentIndex(newIndex);
    dispatch(setSongId(Math.random())); //Used to trigger a re-render of the sequencer  };
    navigate(`/sequencer/id/${newKit._id}`);
    setIsLoading(false);
  };

  const handleBpmChange = (e) => handleParamChange('tempo', e, setLocalTempo, setTempo);
  const handleVolumeChange = (e) => handleParamChange('volume', e, setLocalVolume, setVolume);
  const handleReverbChange = (e) => handleParamChange('reverb', e, setLocalReverb, setReverb);
  const handleDelayChange = (e) => handleParamChange('delay', e, setLocalDelay, setDelay);
  const handleSwingChange = (e) => handleParamChange('swing', e, setLocalSwing, setSwing);
  const handleNumOfStepsChange = (e) =>
    handleParamChange('numOfSteps', e, setLocalNumOfSteps, setNumOfSteps);

  const handleParamChange = (paramName, e, localSetter, dispatchSetter) => {
    if (!e.target.value) return;
    const newValue = Number(e.target.value);
    dispatch(dispatchSetter(newValue));
    localSetter(newValue);

    switch (paramName) {
      case 'tempo':
        Tone.Transport.bpm.value = newValue;
        break;
      case 'volume':
        Tone.Destination.volume.value = Tone.gainToDb(newValue);
        break;
      case 'swing':
        Tone.Transport.swing = newValue;
        break;
      case 'reverb':
        dispatch(setSongId(Math.random()));
        break;
      case 'delay':
        dispatch(setSongId(Math.random()));
        break;
      case 'numOfSteps':
        const newNumOfSteps = parseInt(e.target.value);
        dispatch(setNumOfSteps(newNumOfSteps));
        setLocalNumOfSteps(newNumOfSteps);
        setLocalNumOfStepsPrePortrait(newNumOfSteps);

        dispatch(setSongId(Math.random()));
        break;
      default:
    }
  };

  const handleClearPattern = () => {
    if (isLoading) return;
    setIsLoading(true);
    clearLocalSequencerState();
    dispatch(clearSequencerState());
    dispatch(setSongId(Math.random()));

    setIsLoading(false);
  };

  // Handles sequencer resizing for smaller screens by changing the numOfSteps
  useEffect(() => {
    window.addEventListener('orientationchange', handleSetNumOfSteps);
    window.addEventListener('resize', handleSetNumOfSteps);
    return () => {
      window.removeEventListener('orientationchange', handleSetNumOfSteps);
      window.removeEventListener('resize', handleSetNumOfSteps);
    };
  }, []);

  const handleSetNumOfSteps = () => {
    const orientation = window.screen.orientation?.type;
    const savedNumOfSteps = getLocalNumOfStepsPrePortrait();

    let newNumOfSteps;

    if (orientation?.includes('portrait')) {
      newNumOfSteps = 8;
      //Saving the prev step config so that it can be restored when switching back to landscape
      setLocalNumOfStepsPrePortrait(savedNumOfSteps);
    } else if (savedNumOfSteps > 8 && savedNumOfSteps < 32) {
      newNumOfSteps = 16;
      setLocalNumOfStepsPrePortrait(16);
    } else if (savedNumOfSteps > 16) {
      newNumOfSteps = 32;
      setLocalNumOfStepsPrePortrait(32);
    }
    if (newNumOfSteps) {
      dispatch(setNumOfSteps(newNumOfSteps));
      setLocalNumOfSteps(newNumOfSteps);
    }
  };

  return (
    <section className="sequencer-options">
      <section className="options-wrapper">
        <section className="step-length-wrapper">
          <label className={`${sequencerState.numOfSteps === 16 ? 'checked' : ''}`}>
            <input
              type="radio"
              value="16"
              checked={sequencerState.numOfSteps === 16}
              onChange={handleNumOfStepsChange}
            />
            16
          </label>
          <label className={`${sequencerState.numOfSteps === 32 ? 'checked' : ''}`}>
            <input
              type="radio"
              value="32"
              checked={sequencerState.numOfSteps === 32}
              onChange={handleNumOfStepsChange}
            />
            32
          </label>
        </section>

        <section className="pagination-controls-wrapper">
          <button className="prev-button" onClick={handlePrevKit}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button className="next-button" onClick={handleNextKit}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </section>
        <FilterKits />
        <button className="clear-song-btn" onClick={handleClearPattern}>
          CLR
        </button>
      </section>
      <UserSongsList sequencerState={sequencerState} />

      <section className="range-controls">
        <article className="delay">
          <span>FX1</span>
          <label className="delay-label"></label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.25}
            onChange={handleDelayChange}
            value={sequencerState.delay}
          />
        </article>
        <article className="reverb">
          <span>FX2</span>
          <label className="reverb-label"></label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.25}
            onChange={handleReverbChange}
            value={sequencerState.reverb}
          />
        </article>
        <article className="swing">
          <span>SWNG</span>
          <label className="swing-label"></label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            onChange={handleSwingChange}
            value={sequencerState.swing}
          />
        </article>
        <article className="bpm">
          <span>BPM</span>
          <label className="bpm-label"></label>
          <input
            type="range"
            min={20}
            max={220}
            step={1}
            onChange={handleBpmChange}
            value={sequencerState.tempo}
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
            value={sequencerState.volume}
          />
        </article>
      </section>
    </section>
  );
};

export default sequencerOptions;
