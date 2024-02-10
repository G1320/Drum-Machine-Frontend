import React, { useState, useEffect, useRef, createRef } from 'react';
import '../../assets/styles/components/sequencer/sequencer.scss';
import * as Tone from 'tone';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSounds } from '../../hooks/useSounds.js';
import { PropagateLoader } from 'react-spinners';

import {
  setLocalPattern,
  setLocalMutedTracks,
  getLocalSequencerState,
} from '../../services/sequencer-service';

import { setPattern, setMutedTracks, setSequencerState } from '../../slices/sequencerSlice';
import SequencerStartBtn from './sequencer-start-btn';
import SequencerOptions from './sequencer-options';
import SoundsList from '../sounds/sounds-list';
import SequencerTrackLabelList from './sequencer-track-label-list';
import UserKitsList from '../kits/user-kits-list';

import { toggleArrayItem } from '../../utils/toggleArrayItem';

function Sequencer() {
  const dispatch = useDispatch();
  const { kitId } = useParams();
  const NOTE = 'C2';

  const [numOfSounds, setNumOfSounds] = useState(0);
  const { data: selectedKitSounds } = useSounds(kitId);
  const sequencerState = useSelector((state) => state.sequencer);

  const seqRef = useRef(null);
  const tracksRef = useRef([]);
  const lampsRef = useRef([]);
  //prettier-ignore
  // An array of arrays, the first representing tracks, the second representing steps
  const stepsRef = useRef([...Array(selectedKitSounds.length)].map(() => 
  Array(sequencerState.numOfSteps).fill(null)));

  const trackIds = [...Array(selectedKitSounds.length).keys()];
  const stepIds = [...Array(sequencerState.numOfSteps).keys()];

  useEffect(() => setNumOfSounds(selectedKitSounds.length), [selectedKitSounds]);

  useEffect(() => {
    if (!kitId) return;

    const localSequencerState = getLocalSequencerState();
    dispatch(setSequencerState(localSequencerState));
    handleCheckedStepsUpdate();
  }, [kitId, sequencerState.songId, dispatch, numOfSounds, sequencerState.numOfSteps]);

  const handleCheckedStepsUpdate = () => {
    sequencerState.pattern?.forEach((cellId) => updateStepCheckedState(cellId));
  };

  const updateStepCheckedState = (cellId) => {
    const [trackIndex, stepIndex] = cellId.split('-').map(Number);
    const stepRef = stepsRef.current[trackIndex]?.[stepIndex];
    if (stepRef) stepRef.checked = true;
  };

  useEffect(() => {
    handleSequenceInitialization();
    return () => disposeOldSequence();
  }, [kitId, sequencerState.songId, numOfSounds, sequencerState.numOfSteps]);

  const handleSequenceInitialization = () => {
    disposeOldSequence();
    initNewSequence();
  };

  const disposeOldSequence = () => {
    seqRef.current?.stop();
    seqRef.current?.dispose();
    seqRef.current = null;
    tracksRef.current.forEach((trk) => trk.sampler.dispose());
    tracksRef.current = [];
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
    reverb.wet.value = sequencerState.reverb || 0;

    const delay = new Tone.FeedbackDelay('8n', 0.5).toDestination();
    delay.decay = 3;
    delay.wet.value = sequencerState.delay || 0;

    const normalizedTargetDelayTime = Math.min(Math.max(sequencerState.delay / 4, 0), 1);
    // Use setTargetAtTime for smooth changes in delayTime
    const smoothingTime = 0.25;
    delay.delayTime.setTargetAtTime(normalizedTargetDelayTime, Tone.now(), smoothingTime);

    return { reverb, delay };
  };

  const setupRefsForTracksAndLamps = () => {
    // 2d array of refs representing each step on each track
    stepsRef.current = Array.from(Array(selectedKitSounds.length)).map(() =>
      Array(sequencerState.numOfSteps).fill(null)
    );
    // array of refs representing each lamp
    lampsRef.current = Array.from(Array(sequencerState.numOfSteps + 1)).map(() => ({
      ref: createRef(),
      checked: false,
    }));
  };

  const createTrackSamplers = (effects) => {
    const reverb = effects.reverb;
    const delay = effects.delay;
    // array of track objects containing a sampler with a muted property
    tracksRef.current = selectedKitSounds.map((sound, i) => {
      const muted = sequencerState.mutedTracks.includes(i); // Check if the track is muted
      const sampler = new Tone.Sampler({
        muted,
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

  //prettier-ignore
  // Tone.Transport callbacks pass a scheduled time into the callback because without the Web Audio API, Javascript timing can be quite imprecise. For example, setTimeout(callback, 100) will only be invoked  around 100 milliseconds after called,
  // Many musical applications require sub-millisecond accuracy. The Web Audio API only provides sample-accurate scheduling for methods like start, stop and setValueAtTime,
  // Thus we must use the precise time parameter created by Tone and passed into the callback to schedule methods within the callback.
  const createSequence = () => {
    seqRef.current = new Tone.Sequence(
      // Callback function that will be called on each step of the sequence
      (time, step) => {
        //Handles the sound triggering logic for each step at its precise scheduled time (the sound will trigger when it's time is scheduled, not immediately)
        triggerTrackSamplers(time, step);
        // Sets the checked property of the current step's lamp to true
        lampsRef.current[step].checked = true;
        // Sets the Tone.Sequence instance to start at step 0 + configs it to 16th notes
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
    const updatedPattern = toggleArrayItem(sequencerState.pattern, cellId);

    const [trackIndex, stepIndex] = cellId.split('-').map(Number);
    const stepRef = stepsRef.current[trackIndex]?.[stepIndex];
    if (stepRef) stepRef.checked = updatedPattern.includes(cellId);

    setLocalPattern(updatedPattern);
    dispatch(setPattern(updatedPattern));
  };

  const handleMuteButtonClick = (trackId) => {
    const updatedMutedTracks = toggleArrayItem(sequencerState.mutedTracks, trackId);

    const trackRef = tracksRef.current[trackId];
    if (trackRef) trackRef.muted = !trackRef.muted;

    dispatch(setMutedTracks(updatedMutedTracks));
    setLocalMutedTracks(updatedMutedTracks);
  };

  //sequencer global state change listeners
  useEffect(() => {
    //setting volume and tempo
    Tone.Destination.volume.value = Tone.gainToDb(Number(sequencerState.volume));
    Tone.Transport.bpm.value = sequencerState.tempo;
  }, [sequencerState.tempo, sequencerState.volume]);

  return (
    <>
      <section className="sequencer-external-container">
        <section className="sequencer">
          <SequencerStartBtn />

          <section className={`sequencer-lamp-row  ${sequencerState.numOfSteps === 32 ? 'xl' : ''}`}>
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
                <SequencerTrackLabelList
                  kitId={kitId}
                  selectedKitSounds={selectedKitSounds}
                  numOfSteps={sequencerState.numOfSteps}
                />

                <section key={sequencerState.songId} className="sequencer-column">
                  {trackIds.map((trackId) => {
                    // iterate over each track
                    const isMuted = sequencerState.mutedTracks.includes(trackId); // Check if the track is muted
                    return (
                      <div
                        key={trackId}
                        className={`track-container  ${sequencerState.numOfSteps === 32 ? 'xl' : ''} ${
                          isMuted ? 'muted' : ''
                        }`}
                      >
                        <input
                          className={`sequencer-mute-button  ${isMuted ? 'muted' : ''}  ${
                            sequencerState.numOfSteps === 32 ? 'xl' : ''
                          }`}
                          type="checkbox"
                          checked={isMuted}
                          onChange={() => handleMuteButtonClick(trackId)}
                        />
                        <section
                          key={trackId + 10}
                          className={`sequencer-row  ${sequencerState.numOfSteps === 32 ? 'xl' : ''}`}
                        >
                          {stepIds.map((stepId) => {
                            // iterate over each step on each track to display a cell
                            const id = `${trackId}-${stepId}`;
                            const isSelected = sequencerState.pattern?.includes(id);

                            return (
                              <article
                                key={id}
                                onClick={() => handleCellClick(id)}
                                className={`sequencer-cell ${isSelected ? 'selected' : ''} ${
                                  sequencerState.numOfSteps === 32 ? 'xl' : ''
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
      <SequencerOptions sequencerState={sequencerState} />
      <section className="main-content-bottom-wrapper">
        <UserKitsList />
        <SoundsList kitId={kitId} />
      </section>
    </>
  );
}
export default Sequencer;
