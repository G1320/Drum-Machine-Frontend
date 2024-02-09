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
  setLocalMutedTracks,
} from '../../services/sequencer-service';
import { getLoopedIndex } from '../../utils/getLoopedIndex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const sequencerOptions = ({ numOfSteps, handleNumOfStepsChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const combinedKits = useSelector((state) => state.kits.combinedKits);
  const selectedKit = useSelector((state) => state.kits.selectedKit);

  const sequencerState = useSelector((state) => state.sequencer);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Updating the currentIndex when the selectedKit changes
    const index = combinedKits.findIndex((kit) => kit._id === selectedKit._id);
    setCurrentIndex(index);
  }, [combinedKits, selectedKit]);

  const handleNextKit = () => {
    if (isLoading) return;
    setIsLoading(true);
    const nextIndex = getLoopedIndex(currentIndex, combinedKits.length, 'next');
    const nextKit = combinedKits[nextIndex];

    updateKit(nextKit, nextIndex);
  };

  const handlePrevKit = () => {
    if (isLoading) return;
    setIsLoading(true);
    const prevIndex = getLoopedIndex(currentIndex, combinedKits.length, 'prev');
    const prevKit = combinedKits[prevIndex];

    updateKit(prevKit, prevIndex);
  };

  const updateKit = (kit, index) => {
    setLocalPattern(sequencerState.pattern);
    setLocalMutedTracks([]);
    dispatch(setSelectedKit(kit));
    setCurrentIndex(index);
    dispatch(setSongId(Math.random())); //Used to trigger a rerender of the sequencer
    navigate(`/sequencer/id/${kit._id}`);
    setIsLoading(false);
  };

  const handleBpmChange = (e) => {
    if (!e.target.value) return;
    const newBpm = Number(e.target.value);
    updateBpm(newBpm);
  };

  const handleVolumeChange = (e) => {
    if (!e.target.value) return;
    const newVolume = Number(e.target.value);
    updateVolume(newVolume);
  };

  const updateVolume = (volume) => {
    Tone.Destination.volume.value = Tone.gainToDb(volume);
    setLocalVolume(Number(volume));
    dispatch(setVolume(volume));
  };

  const handleReverbChange = (e) => {
    if (!e.target.value) return;
    const newReverb = Number(e.target.value);
    updateReverb(newReverb);
  };

  const handleSwingChange = (e) => {
    if (!e.target.value) return;
    const newSwing = Number(e.target.value);
    updateSwing(newSwing);
  };

  const updateSwing = (swing) => {
    dispatch(setSwing(swing));
    setLocalSwing(swing);
    dispatch(setSongId(Math.random())); //Used to trigger a rerender of the sequencer
  };

  const updateReverb = (reverb) => {
    dispatch(setReverb(reverb));
    setLocalReverb(reverb);
    dispatch(setSongId(Math.random())); //Used to trigger a rerender of the sequencer
  };

  const handleDelayChange = (e) => {
    if (!e.target.value) return;
    const newDelay = Number(e.target.value);
    updateDelay(newDelay);
  };

  const updateDelay = (delay) => {
    dispatch(setDelay(delay));
    setLocalDelay(delay);
    dispatch(setSongId(Math.random())); //Used to trigger a rerender of the sequencer
  };

  const updateBpm = (bpm) => {
    Tone.Transport.bpm.value = bpm;
    setLocalTempo(bpm);
    dispatch(setTempo(bpm));
  };

  const handleClearPattern = () => {
    if (isLoading) return;
    setIsLoading(true);
    clearLocalSequencerState();
    dispatch(clearSequencerState());
    dispatch(setSongId(Math.random())); //Used to trigger a rerender of the sequencer

    setIsLoading(false);
  };

  return (
    <section className="sequencer-options">
      <section className="options-wrapper">
        <section className="step-length-wrapper">
          <label className={`${numOfSteps === 16 ? 'checked' : ''}`}>
            <input
              type="radio"
              value="16"
              checked={numOfSteps === 16}
              onChange={handleNumOfStepsChange}
            />
            16
          </label>
          <label className={`${numOfSteps === 32 ? 'checked' : ''}`}>
            <input
              type="radio"
              value="32"
              checked={numOfSteps === 32}
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
      <UserSongsList />

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
          <span>SWG</span>
          <label className="swing-label"></label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.25}
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
