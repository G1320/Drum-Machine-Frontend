import React, { useState, useEffect, useRef, createRef } from 'react';
import '../../assets/styles/components/sequencer/sequencer.scss';
import * as Tone from 'tone';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getKitSounds } from '../../services/kit-service';
import {
  getLocalNumOfSteps,
  getLocalSelectedCells,
  localSaveNumOfSteps,
  localSaveSelectedCells,
  getLocalMutedTracks,
  localSaveMutedTracks,
} from '../../services/sequencer-service';

import SequencerStartBtn from './sequencer-start-btn';
import SequencerOptions from './sequencer-options';
import SoundsList from '../sounds/sounds-list';
import SequencerTrackLabelList from './sequencer-track-label-list';
import UserKitsList from '../kits/user-kits-list';
import OrientationLock from './sequencer-orientation-lock';

import { setSelectedKitSounds } from '../../slices/soundsSlice';
import { setSelectedCells } from '../../slices/selectedCellsSlice';

function Sequencer() {
  const dispatch = useDispatch();
  const { kitId } = useParams();
  const NOTE = 'C2';

  const selectedKitSounds = useSelector((state) => state.sounds.selectedKitSounds);
  const [mutedTracks, setMutedTracks] = useState(getLocalMutedTracks() || []);

  const [numOfSteps, setNumOfSteps] = useState(getLocalNumOfSteps() || 16);
  const [numOfSounds, setNumOfSounds] = useState(0);
  const [numOfSelectedCells, setNumOfSelectedCells] = useState(0);
  const selectedCells = useSelector((state) => state.selectedCells.selectedCells);

  const trackIds = [...Array(selectedKitSounds.length).keys()];
  const stepIds = [...Array(numOfSteps).keys()];

  const tracksRef = useRef([]);
  const lampsRef = useRef([]);
  const stepsRef = useRef([...Array(selectedKitSounds.length)].map(() => Array(numOfSteps).fill(null))); // Create an array of arrays, the first array representing tracks, the second representing steps
  const seqRef = useRef(null);

  useEffect(() => {
    const initData = async () => {
      if (!kitId) return;
      handleOrientationChange();

      window.addEventListener('orientationchange', handleOrientationChange);
      try {
        const sounds = await getKitSounds(kitId);
        const selectedCellsFromStorage = getLocalSelectedCells();

        if (selectedCellsFromStorage) dispatch(setSelectedCells(selectedCellsFromStorage));
        if (JSON.stringify(sounds) === JSON.stringify(selectedKitSounds)) return;
        dispatch(setSelectedKitSounds(sounds));

        return () => {
          window.removeEventListener('orientationchange', handleOrientationChange);
        };
      } catch (error) {
        console.error('Failed to init data in sequencer', error);
      }
    };

    initData();
  }, [kitId, selectedKitSounds, dispatch, numOfSounds, numOfSelectedCells]);

  useEffect(() => {
    handleCheckedStepsUpdate();
  }, [selectedCells, selectedKitSounds, numOfSteps]);

  useEffect(() => {
    handleSequenceInitialization();
    return () => {
      seqRef.current?.stop();
      seqRef.current?.dispose();
      tracksRef.current.forEach((trk) => trk.sampler.dispose());
    };
  }, [selectedKitSounds, numOfSounds, numOfSteps, kitId]);

  const handleCheckedStepsUpdate = () => {
    selectedCells.forEach((cellId) => updateStepCheckedState(cellId));
  };

  const updateStepCheckedState = (cellId) => {
    const [trackIndex, stepIndex] = cellId.split('-').map(Number);
    const stepRef = stepsRef.current[trackIndex]?.[stepIndex];
    if (stepRef) stepRef.checked = true;
  };

  const handleSequenceInitialization = () => {
    disposeOldSequence();
    initializeNewSequence();
  };

  const disposeOldSequence = () => {
    seqRef.current?.dispose();
    tracksRef.current?.forEach((trk) => trk.sampler?.dispose());
  };

  const initializeNewSequence = () => {
    const effects = setupEffects();

    setupRefsForTracksAndLamps();
    createTrackSamplers(effects);
    createSequence();
  };

  const setupEffects = () => {
    const reverb = new Tone.Reverb().toDestination();
    reverb.decay = 3;
    reverb.wet.value = 0;

    const delay = new Tone.FeedbackDelay('8n', 0.5).toDestination();
    delay.decay = 3;
    delay.wet.value = 0;

    return { reverb, delay };
  };

  const setupRefsForTracksAndLamps = () => {
    stepsRef.current = Array.from(Array(selectedKitSounds.length)).map(() =>
      Array(numOfSteps).fill(null)
    );
    lampsRef.current = Array.from(Array(numOfSteps + 1)).map(() => ({
      ref: createRef(),
      checked: false,
    }));
  };

  const createTrackSamplers = (effects) => {
    const reverb = effects.reverb;
    const delay = effects.delay;

    tracksRef.current = selectedKitSounds.map((sound, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        muted: false,
        urls: { [NOTE]: sound.src },
        onload: () => {
          tracksRef.current[i].sampler.connect(reverb);
          tracksRef.current[i].sampler.connect(delay);
        },
      }),
    }));
  };

  const createSequence = () => {
    //prettier-ignore
    seqRef.current = new Tone.Sequence(
    // Callback function that will be called on each step of the sequence
  (time, step) => {
    //Handle the sound triggering logic for each step
    triggerTrackSamplers(time, step); 
    // Set the checked property of the current step's lamp to true
    lampsRef.current[step].checked = true;
      },stepIds,'16n').start(0);
  };

  const triggerTrackSamplers = (time, step) => {
    tracksRef.current.forEach((trk) => {
      if (!trk.muted && stepsRef.current[trk.id]?.[step]?.checked) {
        trk.sampler.triggerAttack(NOTE, time);
      }
    });
  };

  const handleCellClick = (id) => {
    const updatedSelectedCells = selectedCells.includes(id)
      ? selectedCells.filter((cellId) => cellId !== id)
      : [...selectedCells, id];
    localSaveSelectedCells(updatedSelectedCells);
    dispatch(setSelectedCells(updatedSelectedCells));
  };

  const handleMuteButtonClick = (trackId) => {
    const updatedMutedTracks = [...mutedTracks];
    const index = updatedMutedTracks.indexOf(trackId);
    index === -1 ? updatedMutedTracks.push(trackId) : updatedMutedTracks.splice(index, 1);

    setMutedTracks(updatedMutedTracks);
    tracksRef.current[trackId].muted = !tracksRef.current[trackId].muted;
    localSaveMutedTracks(updatedMutedTracks);
  };

  const handleNumOfStepsChange = (e) => {
    const newNumOfSteps = parseInt(e.target.value);
    setNumOfSteps(newNumOfSteps);
    localSaveNumOfSteps(newNumOfSteps);
    setNumOfSounds(newNumOfSteps); //Used to trigger a re-render of the sequencer
  };

  useEffect(() => setNumOfSounds(selectedKitSounds.length), [selectedKitSounds]);
  useEffect(() => setNumOfSelectedCells(selectedCells.length), [selectedCells]);

  useEffect(() => {
    //setting initial volume
    Tone.Destination.volume.value = Tone.gainToDb(Number(0.5));
  }, []);

  const handleOrientationChange = () => {
    if (window.screen.orientation.type.includes('portrait')) {
      setNumOfSteps(8);
      localSaveNumOfSteps(8);
    } else if (numOfSteps === 16) {
      setNumOfSteps(16);
      localSaveNumOfSteps(16);
    } else {
      setNumOfSteps(32);
      localSaveNumOfSteps(32);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') Tone.Transport.toggle();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <OrientationLock handleNumOfStepsChange={handleNumOfStepsChange} />{' '}
      <section className="sequencer-external-container">
        <section className="sequencer">
          <SequencerStartBtn />

          <section className={`sequencer-lamp-row  ${numOfSteps === 32 ? 'xl' : ''}`}>
            {stepIds.map((stepId) => (
              // iterate over each step to display a lamp
              <label key={stepId} className="sequencer-lamp">
                <input
                  className="sequencer-lamp-input"
                  type="radio"
                  name="lamp"
                  id={`lamp-${stepId}`}
                  ref={(el) => {
                    if (!el) return;
                    lampsRef.current[stepId] = el;
                  }}
                />
              </label>
            ))}
          </section>

          <section className="sequencer-scroll-container">
            <SequencerTrackLabelList kitId={kitId} />

            <section className="sequencer-column">
              {trackIds.map((trackId) => {
                // iterate over each track
                const isMuted = mutedTracks.includes(trackId); // Check if the channel is muted
                // const isFxEnabled = fxEnabled[trackId];
                return (
                  <div
                    key={trackId}
                    className={`track-container  ${numOfSteps === 32 ? 'xl' : ''} ${
                      isMuted ? 'muted' : ''
                    }`}
                  >
                    <input
                      className={`sequencer-mute-button  ${isMuted ? 'muted' : ''}  ${
                        numOfSteps === 32 ? 'xl' : ''
                      }`}
                      type="checkbox"
                      checked={isMuted}
                      onChange={() => handleMuteButtonClick(trackId)}
                    />
                    <section
                      key={trackId + 10}
                      className={`sequencer-row  ${numOfSteps === 32 ? 'xl' : ''}`}
                    >
                      {stepIds.map((stepId) => {
                        // iterate over each step on each track to display a cell
                        const id = `${trackId}-${stepId}`;
                        const isSelected = selectedCells.includes(id);

                        return (
                          <article key={id}>
                            <label
                              key={id}
                              htmlFor={id + 20}
                              onClick={() => handleCellClick(id)}
                              className={`sequencer-cell ${isSelected ? 'selected' : ''}`}
                            />
                            <input
                              className="sequencer-cell-input step-checkbox"
                              key={id + 10}
                              id={id + 20}
                              type="checkbox"
                              ref={(el) => {
                                if (!el) return;
                                if (!stepsRef.current[trackId]) {
                                  stepsRef.current[trackId] = [];
                                }
                                stepsRef.current[trackId][stepId] = el;
                              }}
                            />
                          </article>
                        );
                      })}
                    </section>
                  </div>
                );
              })}
            </section>
          </section>
        </section>
      </section>
      <SequencerOptions numOfSteps={numOfSteps} handleNumOfStepsChange={handleNumOfStepsChange} />
      <section className="main-content-bottom-wrapper">
        <UserKitsList />
        <SoundsList kitId={kitId} />
      </section>
    </>
  );
}
export default Sequencer;
