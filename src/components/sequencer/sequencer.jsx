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
import { setSelectedKitId } from '../../slices/kitsSlice';

function Sequencer() {
  const dispatch = useDispatch();
  const { kitId } = useParams();
  const NOTE = 'C2';

  const selectedKitSounds = useSelector((state) => state.sounds.selectedKitSounds);

  const [numOfSteps, setNumOfSteps] = useState(16);
  const [numOfSounds, setNumOfSounds] = useState(0);
  const [selectedCells, setSelectedCells] = useState([]);

  const trackIds = [...Array(selectedKitSounds.length).keys()];
  const stepIds = [...Array(numOfSteps).keys()];

  const tracksRef = useRef([]);
  const lampsRef = useRef([]);
  const stepsRef = useRef([...Array(selectedKitSounds.length)].map(() => Array(numOfSteps).fill(null))); // Create an array of arrays, the first array representing tracks, the second representing steps
  const seqRef = useRef(null);

  useEffect(() => {
    const getSounds = async () => {
      if (kitId) {
        try {
          const sounds = await getKitSounds(kitId);
          if (JSON.stringify(sounds) === JSON.stringify(selectedKitSounds)) return;
          dispatch(setSelectedKitSounds(sounds));
        } catch (error) {
          console.error('Failed to load kit', error);
        }
      }
    };

    getSounds();
  }, [kitId, selectedKitSounds]);

  useEffect(() => setNumOfSounds(selectedKitSounds.length), [selectedKitSounds]);

  useEffect(() => {
    // create a 2D array of refs for the steps
    stepsRef.current = Array.from(Array(selectedKitSounds)).map(() => {
      return Array.from(Array(tracksRef.current.length)).map(() => {
        return createRef();
      });
    });
    // create an array of refs for the lamps
    lampsRef.current = Array.from(Array(numOfSteps + 1)).map(() => {
      return { ref: createRef(), checked: false };
    });
    // create an array of objects representing each track
    tracksRef.current = selectedKitSounds.map((sound, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sound.src,
        },
      }).toDestination(),
    }));
    seqRef.current = new Tone.Sequence( // create a new Tone.Sequence object with a callback function
      (time, step) => {
        // iterate over each track and trigger the sampler if the step is checked
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            // console.log('stepsRef.current[trk.id]: ', stepsRef.current[trk.id]);
            trk.sampler.triggerAttack(NOTE, Tone.now());
          }
        });
        lampsRef.current[step].checked = true; // set the current lamp to checked
      },
      [...stepIds], // pass in the stepIds array as the sequence events
      '16n' // set the subdivision to 16th notes
    );
    seqRef.current.start(0); // start the sequence at time 0

    return () => {
      // cleanup function
      seqRef.current?.dispose(); // dispose of the Tone.Sequence object
      tracksRef.current.map((trk) => void trk.sampler.dispose()); // dispose of each sampler
    };
  }, [numOfSounds]);

  const handleCellClick = (id) => {
    setSelectedCells((prevSelectedCells) => {
      if (prevSelectedCells.includes(id)) {
        return prevSelectedCells.filter((cellId) => cellId !== id);
      } else {
        return [...prevSelectedCells, id];
      }
    });
  };

  const handleNumOfStepsChange = (event) => {
    const newNumOfSteps = parseInt(event.target.value);
    setNumOfSteps(newNumOfSteps);
    setNumOfSounds(newNumOfSteps);
  };

  return (
    <>
      <section className="sequencer">
        <SequencerStartBtn />

        <section className="sequencer-lamp-row ">
          {stepIds.map((stepId) => (
            // iterate over each step to display its lamp
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
              <section key={trackId} className={`sequencer-row  ${numOfSteps === 32 ? 'xl' : ''}`}>
                {stepIds.map((stepId) => {
                  // iterate over each step on every track and display a cells
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
      <SequencerOptions numOfSteps={numOfSteps} handleNumOfStepsChange={handleNumOfStepsChange} />
      <SoundsList kitId={kitId} />
    </>
  );
}

export default Sequencer;
