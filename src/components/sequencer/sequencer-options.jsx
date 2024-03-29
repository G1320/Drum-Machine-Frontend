import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/sequencer/sequencer-options.scss';
import { Transport, Destination, gainToDb } from 'tone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FilterKits from '../kits/filter-kits';
import UserSongsList from '../songs/user-songs-list';
import { setSelectedKit } from '../../slices/kitsSlice';

import * as sequencerSlice from '../../slices/sequencerSlice';
import * as sequencerService from '../../services/sequencer-service';
import { getLoopedIndex } from '../../utils/getLoopedIndex';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const sequencerOptions = ({ sequencerState }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const combinedKits = useSelector((state) => state.kits.combinedKits);
  const selectedKit = useSelector((state) => state.kits.selectedKit);

  useEffect(() => {
    // Updating the currentIndex when the selectedKit changes
    setCurrentIndex(combinedKits.findIndex((kit) => kit._id === selectedKit._id));
  }, [selectedKit]);

  const handleNextKit = () => handleKitChange('next');
  const handlePrevKit = () => handleKitChange('prev');

  const handleBpmChange = (e) =>
    handleParamChange('tempo', e, sequencerService.setLocalTempo, sequencerSlice.setTempo);

  const handleVolumeChange = (e) =>
    handleParamChange('volume', e, sequencerService.setLocalVolume, sequencerSlice.setVolume);

  const handleReverbChange = (e) =>
    handleParamChange('reverb', e, sequencerService.setLocalReverb, sequencerSlice.setReverb);

  const handleDelayChange = (e) =>
    handleParamChange('delay', e, sequencerService.setLocalDelay, sequencerSlice.setDelay);

  const handleSwingChange = (e) =>
    handleParamChange('swing', e, sequencerService.setLocalSwing, sequencerSlice.setSwing);
  //prettier-ignore
  const handleNumOfStepsChange = (e) =>
    handleParamChange('numOfSteps',e,sequencerService.setLocalNumOfSteps,sequencerSlice.setNumOfSteps);

  const handleKitChange = (direction) => {
    const newIndex = getLoopedIndex(currentIndex, combinedKits.length, direction);
    const newKit = combinedKits[newIndex];

    if (newKit) {
      sequencerService.setLocalPattern(sequencerState.pattern);
      sequencerService.setLocalMutedTracks([]);
      dispatch(setSelectedKit(newKit));
      setCurrentIndex(newIndex);
      dispatch(sequencerSlice.setSongId(Math.random()));
      navigate(`/sequencer/id/${newKit._id}`);
    } else {
      console.error('Issue occurred while changing kit');
    }
  };

  const handleParamChange = (paramName, e, localSetter, dispatchSetter) => {
    if (!e.target.value) return;
    const newValue = Number(e.target.value);
    dispatch(dispatchSetter(newValue));
    localSetter(newValue);

    switch (paramName) {
      case 'tempo':
        Transport.bpm.value = newValue;
        break;
      case 'volume':
        Destination.volume.value = gainToDb(newValue);
        break;
      case 'swing':
        Transport.swing = newValue;
        break;
      case 'reverb':
      case 'delay':
        dispatch(sequencerSlice.setSongId(Math.random()));
        break;
      case 'numOfSteps':
        sequencerService.setLocalNumOfStepsPrePortrait(newValue);
        dispatch(sequencerSlice.setSongId(Math.random()));
        break;
      default:
    }
  };

  const handleClearPattern = () => {
    sequencerService.clearLocalSequencerState();
    dispatch(sequencerSlice.clearSequencerState());
    dispatch(sequencerSlice.setSongId(Math.random()));
  };

  useEffect(() => {
    handleSetNumOfSteps();
  }, []);

  useEffect(() => {
    const handleArrowKeyPress = (e) => {
      if (e.key === 'ArrowRight') {
        handleNextKit();
      } else if (e.key === 'ArrowLeft') {
        handlePrevKit();
      }
    };

    window.addEventListener('orientationchange', handleSetNumOfSteps);
    window.addEventListener('resize', handleSetNumOfSteps);
    window.addEventListener('keydown', handleArrowKeyPress);
    return () => {
      window.removeEventListener('orientationchange', handleSetNumOfSteps);
      window.removeEventListener('resize', handleSetNumOfSteps);
      window.removeEventListener('keydown', handleArrowKeyPress);
    };
  }, [handleNextKit, handlePrevKit]);

  const handleSetNumOfSteps = () => {
    const orientation = window.screen.orientation?.type;
    const windowWidth = window.innerWidth;
    const savedNumOfSteps = sequencerService.getLocalNumOfStepsPrePortrait();

    let newNumOfSteps;

    if (orientation?.includes('portrait') || windowWidth < 700) {
      newNumOfSteps = 8;
      //Saving the prev step config so that it can be restored when switching back to landscape
      sequencerService.setLocalNumOfStepsPrePortrait(savedNumOfSteps);
    } else if (savedNumOfSteps === 16) {
      newNumOfSteps = 16;
      sequencerService.setLocalNumOfStepsPrePortrait(16);
    } else if (savedNumOfSteps === 32) {
      newNumOfSteps = 32;
      sequencerService.setLocalNumOfStepsPrePortrait(32);
    } else if (savedNumOfSteps === 64) {
      newNumOfSteps = 64;
      sequencerService.setLocalNumOfStepsPrePortrait(64);
    }
    if (newNumOfSteps) {
      sequencerService.setLocalNumOfSteps(newNumOfSteps);
      dispatch(sequencerSlice.setNumOfSteps(newNumOfSteps));
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
          <label className={`${sequencerState.numOfSteps === 64 ? 'checked' : ''}`}>
            <input
              type="radio"
              value="64"
              checked={sequencerState.numOfSteps === 64}
              onChange={handleNumOfStepsChange}
            />
            64
          </label>
        </section>

        <section className="pagination-controls-wrapper">
          <button className="prev-button" onClick={handlePrevKit}>
            <FontAwesomeIcon className="fa-icon-nav" icon={faChevronLeft} />
          </button>
          <button className="next-button" onClick={handleNextKit}>
            <FontAwesomeIcon className="fa-icon-nav" icon={faChevronRight} />
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
            value={sequencerState.tempo || 120}
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
