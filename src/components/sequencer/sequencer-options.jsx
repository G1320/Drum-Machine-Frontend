import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/sequencer/sequencer-options.scss';
import * as Tone from 'tone';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import FilterKits from '../kits/filter-kits';
import { setSelectedKit } from '../../slices/kitsSlice';
import { setIsPlaying } from '../../slices/transportSlice';
import { clearSelectedCells } from '../../slices/selectedCellsSlice';
import { localSaveSelectedCells } from '../../services/sequencer-service';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const sequencerOptions = ({ numOfSteps, handleNumOfStepsChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { kitId } = useParams();
  const combinedKits = useSelector((state) => state.kits.combinedKits);
  const selectedKit = useSelector((state) => state.kits.selectedKit);
  const selectedCells = useSelector((state) => state.selectedCells.selectedCells);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reverbWet, setReverbWet] = useState(0.5);

  useEffect(() => {
    // Update the currentIndex when the selectedKit changes
    const index = combinedKits.findIndex((kit) => kit._id === selectedKit._id);
    setCurrentIndex(index);
  }, [combinedKits, selectedKit]);

  const handleNextKit = () => {
    const nextIndex = currentIndex === combinedKits.length - 1 ? 0 : currentIndex + 1;
    const nextKit = combinedKits[nextIndex];
    Tone.Transport.stop();
    dispatch(setIsPlaying(false));

    localSaveSelectedCells(selectedCells);
    dispatch(clearSelectedCells());
    dispatch(setSelectedKit(nextKit));
    setCurrentIndex(nextIndex);
    navigate(`/sequencer/id/${nextKit._id}`);
  };

  const handlePrevKit = async () => {
    const prevIndex = currentIndex === 0 ? combinedKits.length - 1 : currentIndex - 1;
    const prevKit = combinedKits[prevIndex];
    Tone.Transport.stop();
    dispatch(setIsPlaying(false));

    localSaveSelectedCells(selectedCells);
    dispatch(clearSelectedCells());
    dispatch(setSelectedKit(prevKit));
    setCurrentIndex(prevIndex);
    navigate(`/sequencer/id/${prevKit._id}`);
  };

  const handleBpmChange = (e) => {
    Tone.Transport.bpm.value = Number(e.target.value);
  };

  const handleVolumeChange = (e) => {
    Tone.Destination.volume.value = Tone.gainToDb(Number(e.target.value));
  };

  const handleClearPattern = () => {
    localSaveSelectedCells(null);
    dispatch(clearSelectedCells());
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

        <article className="pagination-controls-wrapper">
          <button className="prev-button" onClick={handlePrevKit}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button className="next-button" onClick={handleNextKit}>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </article>
        <FilterKits />
        <button onClick={handleClearPattern}>CLR</button>
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
        {/* <article className="reverb-wet">
          <span>Reverb Wetness</span>
          <label className="reverb-wet-label"></label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={reverbWet}
            onChange={handleReverbWetChange}
          />
        </article> */}
      </section>
    </section>
  );
};

export default sequencerOptions;
