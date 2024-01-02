import React, { useState, useEffect, useRef, createRef } from 'react';
import '../../assets/styles/components/sequencer/sequencer.scss';
import * as Tone from 'tone';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getKitSounds } from '../../services/kit-service';
import SequencerStartBtn from './sequencer-start-btn';
import SequencerOptions from './sequencer-options';
import SoundsList from '../sounds/sounds-list';
import SequencerTrackLabelList from './sequencer-track-label-list';

import { setSelectedKitSounds } from '../../slices/soundsSlice';
import { setSelectedCells, toggleSelectedCell } from '../../slices/selectedCellsSlice';
import { getLocalSelectedCells, localSaveSelectedCells } from '../../services/sequencer-service';
import UserKitsList from '../kits/user-kits-list';

function Sequencer() {
  const dispatch = useDispatch();
  const { kitId } = useParams();
  const NOTE = 'C2';

  const selectedKitSounds = useSelector((state) => state.sounds.selectedKitSounds);

  const [numOfSteps, setNumOfSteps] = useState(16);
  const [numOfSounds, setNumOfSounds] = useState(0);
  const selectedCells = useSelector((state) => state.selectedCells.selectedCells);

  const [sequencerKey, setSequencerKey] = useState(0);

  const trackIds = [...Array(selectedKitSounds.length).keys()];
  const stepIds = [...Array(numOfSteps).keys()];

  const tracksRef = useRef([]);
  const lampsRef = useRef([]);
  const stepsRef = useRef([...Array(selectedKitSounds.length)].map(() => Array(numOfSteps).fill(null))); // Create an array of arrays, the first array representing tracks, the second representing steps
  const seqRef = useRef(null);

  useEffect(() => {
    const getSounds = async () => {
      if (!kitId) return;
      try {
        const sounds = await getKitSounds(kitId);
        const selectedCells = getLocalSelectedCells();
        if (selectedCells) dispatch(setSelectedCells(selectedCells));
        if (JSON.stringify(sounds) === JSON.stringify(selectedKitSounds)) return;
        dispatch(setSelectedKitSounds(sounds));

        setSequencerKey((prevKey) => prevKey + 1); // Increment sequencerKey to force a re-render
      } catch (error) {
        console.error('Failed to load kit', error);
      }
    };

    getSounds();
  }, [kitId, selectedKitSounds, dispatch, numOfSounds]);

  useEffect(() => {
    const selectedCellsFromStorage = JSON.parse(sessionStorage.getItem('selectedCells'));
    if (selectedCellsFromStorage) {
      dispatch(setSelectedCells(selectedCellsFromStorage));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!selectedCells.length) return;
    selectedCells.forEach((cellId) => {
      const [trackIndex, stepIndex] = cellId.split('-').map(Number);
      if (stepsRef.current[trackIndex] && stepsRef.current[trackIndex][stepIndex]) {
        stepsRef.current[trackIndex][stepIndex].checked = true;
      }
    });
  }, [selectedCells, stepsRef, selectedKitSounds]);

  useEffect(() => {
    seqRef.current?.dispose();
    tracksRef.current?.forEach((trk) => trk.sampler?.dispose());

    const reverb = new Tone.Reverb().toDestination();
    reverb.decay = 3;
    reverb.wet.value = 0;
    // create a 2D array of refs representing the steps of each track
    stepsRef.current = Array.from(Array(selectedKitSounds)).map(() => {
      return Array.from(Array(tracksRef.current.length)).map(() => {
        return createRef();
      });
    });
    // create an array of refs for the lamps
    lampsRef.current = Array.from(Array(numOfSteps + 1)).map(() => {
      return { ref: createRef(), checked: false };
    });
    if (Tone.Transport.state === 'started') {
      seqRef.current.start(0);
    }

    // create an array of objects representing each track
    tracksRef.current = selectedKitSounds.map((sound, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: { [NOTE]: sound.src },
        onload: () => {
          // Connect the sampler to the reverb effect
          tracksRef.current[i].sampler.connect(reverb);
        },
      }),
    }));

    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
        });
        lampsRef.current[step].checked = true;
      },
      [...stepIds],
      '16n'
    );
    seqRef.current.start(0); // start the sequence at time 0

    return () => {
      // cleanup function
      seqRef.current?.stop();
      seqRef.current?.dispose();
      tracksRef.current.forEach((trk) => trk.sampler.dispose());
      // tracksRef.current.map((trk) => void trk.sampler.dispose()); // disposing of each sampler (track)
    };
  }, [selectedKitSounds, numOfSounds, numOfSteps, kitId]);

  const handleCellClick = (id) => {
    dispatch(toggleSelectedCell(id));
    const updatedSelectedCells = selectedCells.includes(id)
      ? selectedCells.filter((cellId) => cellId !== id)
      : [...selectedCells, id];
    dispatch(setSelectedCells(updatedSelectedCells));
    localSaveSelectedCells(updatedSelectedCells);
  };

  useEffect(() => setNumOfSounds(selectedKitSounds.length), [selectedKitSounds]);

  const handleNumOfStepsChange = (event) => {
    const newNumOfSteps = parseInt(event.target.value);
    setNumOfSteps(newNumOfSteps);
    setNumOfSounds(newNumOfSteps);
  };

  return (
    <>
      <section key={sequencerKey} className="sequencer-external-container">
        <section className="sequencer">
          <SequencerStartBtn key={sequencerKey} />

          <section className="sequencer-lamp-row ">
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
              {trackIds.map((trackId) => (
                // iterate over each track
                <section
                  key={trackId + sequencerKey}
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
              ))}
            </section>
          </section>
        </section>
      </section>
      <SequencerOptions numOfSteps={numOfSteps} handleNumOfStepsChange={handleNumOfStepsChange} />
      <section className="sequencer-bottom-wrapper">
        <UserKitsList className="sequencer-user-kits-list" />
        <SoundsList className="sequencer-sounds-list" kitId={kitId} />
      </section>
    </>
  );
}

export default Sequencer;
