import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/sequencer/sequencer-options.scss';
import * as Tone from 'tone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import FilterKits from '../kits/filter-kits';
import UserSongsList from '../songs/user-songs-list';
import { setSelectedKit } from '../../slices/kitsSlice';
import { setTempo, setVolume, clearSequencerState, setSelectedCells } from '../../slices/sequencerSlice';
import {
  clearSequencerStorage,
  localSaveSelectedCells,
  localSaveTempo,
  localSaveVolume,
  getLocalMutedTracks,
  localSaveMutedTracks,
} from '../../services/sequencer-service';
import { getLoopedIndex } from '../../utils/getLoopedIndex';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const sequencerOptions = ({ numOfSteps, handleNumOfStepsChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const combinedKits = useSelector((state) => state.kits.combinedKits);
  const selectedKit = useSelector((state) => state.kits.selectedKit);
  const selectedCells = useSelector((state) => state.sequencer.selectedCells);
  const masterTempo = useSelector((state) => state.sequencer.tempo);
  const masterVolume = useSelector((state) => state.sequencer.volume);
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
    localSaveSelectedCells(selectedCells);
    localSaveMutedTracks([]);
    dispatch(setSelectedKit(kit));
    setCurrentIndex(index);
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
    localSaveVolume(Number(volume));
    dispatch(setVolume(volume));
  };

  const updateBpm = (bpm) => {
    Tone.Transport.bpm.value = bpm;
    localSaveTempo(bpm);
    dispatch(setTempo(bpm));
  };

  const handleClearPattern = () => {
    if (isLoading) return;
    const mutedTracks = getLocalMutedTracks();
    if (selectedCells.length === 0 && mutedTracks.length === 0) return;
    setIsLoading(true);

    clearSequencerStorage();
    dispatch(clearSequencerState());
    dispatch(setSelectedCells([]));
    setIsLoading(false);
  };

  return (
    <section className="sequencer-options">
      <section className="options-wrapper">
        <section className="step-length-wrapper">
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
        <article className="bpm">
          <span>BPM</span>
          <label className="bpm-label"></label>
          <input
            type="range"
            min={20}
            max={220}
            step={1}
            onChange={handleBpmChange}
            value={masterTempo}
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
            value={masterVolume}
          />
        </article>
      </section>
    </section>
  );
};

export default sequencerOptions;
