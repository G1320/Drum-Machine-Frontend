import React, { useState, useEffect, useRef, createRef } from 'react';
import '../../assets/styles/components/sequencer/sequencer.scss';
import * as Tone from 'tone';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSounds } from '../../hooks/useSounds.js';
import { PropagateLoader } from 'react-spinners';

import {
  getLocalNumOfSteps,
  setLocalNumOfSteps,
  setLocalPattern,
  setLocalMutedTracks,
  getLocalSequencerState,
} from '../../services/sequencer-service';

import SequencerStartBtn from './sequencer-start-btn';
import SequencerOptions from './sequencer-options';
import SoundsList from '../sounds/sounds-list';
import SequencerTrackLabelList from './sequencer-track-label-list';
import UserKitsList from '../kits/user-kits-list';
import OrientationLock from './sequencer-orientation-lock';

import {
  setPattern,
  setNumOfSteps,
  setSequencerState,
  setMutedTracks,
} from '../../slices/sequencerSlice';
import { toggleArrayItem } from '../../utils/toggleArrayItem';

function Sequencer() {
  const dispatch = useDispatch();
  const { kitId } = useParams();
  const NOTE = 'C2';

  const songId = useSelector((state) => state.sequencer.songId);
  const masterTempo = useSelector((state) => state.sequencer.tempo);
  const masterVolume = useSelector((state) => state.sequencer.volume);
  const mutedTracks = useSelector((state) => state.sequencer.mutedTracks);
  const numOfSteps = useSelector((state) => state.sequencer.numOfSteps);
  const pattern = useSelector((state) => state.sequencer.pattern);

  const [numOfSounds, setNumOfSounds] = useState(0);
  const [lengthOfPattern, setLengthOfPattern] = useState(0);

  const { data: selectedKitSounds } = useSounds(kitId);

  const trackIds = [...Array(selectedKitSounds.length).keys()];
  const stepIds = [...Array(numOfSteps).keys()];

  const tracksRef = useRef([]);
  const lampsRef = useRef([]);
  // An array of arrays, the first representing tracks, the second representing steps
  const stepsRef = useRef([...Array(selectedKitSounds.length)].map(() => Array(numOfSteps).fill(null)));
  const seqRef = useRef(null);

  useEffect(() => setNumOfSounds(selectedKitSounds.length), [selectedKitSounds]);
  useEffect(() => setLengthOfPattern(pattern.length), [pattern]);

  useEffect(() => {
    window.addEventListener('orientationchange', handleSetNumOfSteps);
    window.addEventListener('resize', handleSetNumOfSteps);
    return () => {
      window.removeEventListener('orientationchange', handleSetNumOfSteps);
      window.removeEventListener('resize', handleSetNumOfSteps);
    };
  }, []);

  useEffect(() => {
    if (!kitId) return;
    const sequencerState = getLocalSequencerState();
    dispatch(setSequencerState(sequencerState));

    handleSetNumOfSteps();
    handleCheckedStepsUpdate();
  }, [kitId, songId, dispatch, numOfSounds, numOfSteps, lengthOfPattern]);

  useEffect(() => {
    handleSequenceInitialization();
    return () => {
      seqRef.current?.stop();
      seqRef.current?.dispose();
      seqRef.current = null;
      tracksRef.current.forEach((trk) => trk.sampler.dispose());
      tracksRef.current = [];
    };
  }, [kitId, songId, selectedKitSounds, numOfSounds, numOfSteps]);

  useEffect(() => {
    handleCheckedStepsUpdate();
  }, [kitId, numOfSounds, numOfSteps, pattern]);

  const handleCheckedStepsUpdate = () => {
    pattern?.forEach((cellId) => updateStepCheckedState(cellId));
  };

  const updateStepCheckedState = (cellId) => {
    const [trackIndex, stepIndex] = cellId.split('-').map(Number);
    const stepRef = stepsRef.current[trackIndex]?.[stepIndex];
    if (stepRef) stepRef.checked = true;
  };

  const handleSequenceInitialization = () => {
    disposeOldSequence();
    initNewSequence();
  };

  const disposeOldSequence = () => {
    seqRef.current?.dispose();
    tracksRef.current?.forEach((trk) => trk.sampler?.dispose());
  };

  const initNewSequence = () => {
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
    // 2d array of refs representing each step on each track
    stepsRef.current = Array.from(Array(selectedKitSounds.length)).map(() =>
      Array(numOfSteps).fill(null)
    );
    // array of refs representing each lamp
    lampsRef.current = Array.from(Array(numOfSteps + 1)).map(() => ({
      ref: createRef(),
      checked: false,
    }));
  };

  const createTrackSamplers = (effects) => {
    const reverb = effects.reverb;
    const delay = effects.delay;
    // array of track objects containing a sampler with a muted property
    tracksRef.current = selectedKitSounds.map((sound, i) => {
      const muted = mutedTracks.includes(i); // Check if the channel is muted
      const sampler = new Tone.Sampler({
        muted: muted,
        urls: { [NOTE]: sound.src },
        isLoaded: false,
        onload: () => {
          sampler.connect(reverb);
          sampler.connect(delay);
          sampler.isLoaded = true;
        },
      });
      return { id: i, sampler, muted };
    });
  };

  const createSequence = () => {
    //prettier-ignore
    seqRef.current = new Tone.Sequence(
    // Callback function that will be called on each step of the sequence
    (time, step) => {
    //Handles the sound triggering logic for each step
    triggerTrackSamplers(time, step);
    // Sets the checked property of the current step's lamp to true
    lampsRef.current[step].checked = true;
    // sets the Tone.Sequence instance to start at step 0 & setting it to 16th notes
      },stepIds,'16n').start(0);
  };

  const triggerTrackSamplers = (time, step) => {
    tracksRef.current.forEach((trk) => {
      if (!trk.muted && stepsRef.current[trk.id]?.[step]?.checked) {
        trk.sampler.triggerAttack(NOTE, time);
      }
    });
  };

  const handleCellClick = (cellId) => {
    const updatedPattern = toggleArrayItem(pattern, cellId);

    const [trackIndex, stepIndex] = cellId.split('-').map(Number);
    const stepRef = stepsRef.current[trackIndex]?.[stepIndex];
    if (stepRef) stepRef.checked = updatedPattern.includes(cellId);

    setLocalPattern(updatedPattern);
    dispatch(setPattern(updatedPattern));
  };

  const handleMuteButtonClick = (trackId) => {
    const updatedMutedTracks = toggleArrayItem(mutedTracks, trackId);

    const trackRef = tracksRef.current[trackId];
    if (trackRef) trackRef.muted = !trackRef.muted;

    dispatch(setMutedTracks(updatedMutedTracks));
    setLocalMutedTracks(updatedMutedTracks);
  };

  const handleNumOfStepsChange = (e) => {
    const newNumOfSteps = parseInt(e.target.value);
    dispatch(setNumOfSteps(newNumOfSteps));
    setLocalNumOfSteps(newNumOfSteps);
    setNumOfSounds(newNumOfSteps); //Used to trigger a re-render of the sequencer
  };

  useEffect(() => {
    //setting volume and tempo
    Tone.Transport.bpm.value = masterTempo;
    Tone.Destination.volume.value = Tone.gainToDb(Number(masterVolume));
  }, [masterTempo, masterVolume]);

  const handleSetNumOfSteps = () => {
    const currentNumOfSteps = getLocalNumOfSteps();
    if (!window.screen.orientation || !window.screen.orientation.type) return;
    const orientation = window.screen.orientation.type;
    if (orientation.includes('portrait')) {
      dispatch(setNumOfSteps(8));
      setLocalNumOfSteps(8);
    } else if (currentNumOfSteps > 8 && currentNumOfSteps < 32) {
      dispatch(setNumOfSteps(16));
      setLocalNumOfSteps(16);
    } else if (currentNumOfSteps > 16) {
      dispatch(setNumOfSteps(32));
      setLocalNumOfSteps(32);
    }
  };

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
          <section className="sequencer-external-scroll-container">
            {selectedKitSounds.length === 0 ? (
              <PropagateLoader
                className="sequencer-loader"
                speedMultiplier={1.25}
                color="#fcfcfc"
                size={24}
              />
            ) : (
              <section className="sequencer-internal-scroll-container">
                <SequencerTrackLabelList kitId={kitId} />

                <section className="sequencer-column">
                  {trackIds.map((trackId) => {
                    // iterate over each track
                    const isMuted = mutedTracks.includes(trackId); // Check if the channel is muted
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
                            const isSelected = pattern?.includes(id);

                            return (
                              <article
                                key={id}
                                onClick={() => handleCellClick(id)}
                                className={`sequencer-cell ${isSelected ? 'selected' : ''} ${
                                  numOfSteps === 32 ? 'xl' : ''
                                }`}
                              >
                                <label key={id} htmlFor={id + 20} />
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
            )}
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
