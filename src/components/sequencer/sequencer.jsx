import React, { useState, useEffect, useRef, createRef } from 'react';
import * as Tone from 'tone';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import SequencerPad from './sequencer-pad';
import PlayButton from './sequencer-start-btn';
import { getKitSounds } from '../../services/kit-service';
import '../../assets/styles/components/sequencer/sequencer.css';

function Sequencer() {
  const numOfSteps = 8;
  const { kitId } = useParams();
  const [kitSounds, setKitSounds] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const NOTE = 'C2';

  const trackIds = [...Array(8).keys()]; // create an array of track ids based on the length of kitSounds
  const stepIds = [...Array(numOfSteps).keys()]; // create an array of step ids based on the numOfSteps constant

  const tracksRef = useRef([]); // create a ref for the tracks
  const stepsRef = useRef([[]]); // create a ref for the steps
  const lampsRef = useRef([]); // create a ref for the lamps
  const seqRef = useRef(null); // create a ref for the Tone.Sequence object

  const handleStartClick = async () => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
      lampsRef.current[0].checked = true; // set the first lamp to checked
    }
  };

  useEffect(() => {
    const fetchKitSounds = async () => {
      try {
        const sounds = await getKitSounds(kitId); // fetch the kit sounds from the server
        setKitSounds(sounds); // set the kit sounds state
      } catch (error) {}
    };
    fetchKitSounds();
  }, [kitId, kitSounds]);

  useEffect(() => {
    stepsRef.current = Array.from(Array(numOfSteps)).map(() => {
      // create a 2D array of refs for the steps
      return Array.from(Array(tracksRef.current.length)).map(() => {
        return createRef();
      });
    });
    lampsRef.current = Array.from(Array(numOfSteps + 1)).map(() => {
      // create an array of refs for the lamps
      return { ref: createRef(), checked: false };
    });
    tracksRef.current = kitSounds.map((sound, i) => ({
      // create an array of objects representing each track
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sound.src,
        },
      }).toDestination(),
    }));
    seqRef.current = new Tone.Sequence( // create a new Tone.Sequence object with a callback function
      (time, step) => {
        tracksRef.current.map((trk) => {
          // iterate over each track and trigger the sampler if the step is checked
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            console.log('stepsRef.current[trk.id]: ', stepsRef.current[trk.id]);
            trk.sampler.triggerAttack(NOTE, time);
          }
        });
        console.log(step); // log the current step
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
  }, []);

  return (
    <section className="sequencer">
      <div className="sequencer-lamp-row ">
        {stepIds.map(
          (
            stepId // iterate over each step and display a lamp
          ) => (
            <label key={stepId} className="sequencer-lamp">
              <input
                type="radio"
                name="lamp"
                id={`lamp-${stepId}`}
                ref={(elm) => {
                  if (!elm) return;
                  lampsRef.current[stepId] = elm;
                  // console.log('elm: ', elm);
                }}
                className="sequencer-lamp-input"
              />
              <div className="sequencer-lamp-content" />
            </label>
          )
        )}
      </div>

      {/* <div className="sequencer-internal-wrapper"> */}
      <div className="cell-list">
        {kitSounds.map(
          (
            sample // iterate over each kit sound and display its title
          ) => (
            <div key={sample._id}>
              <p>{sample.title}</p>
            </div>
          )
        )}
      </div>
      <div className="sequencer-row">
        {trackIds.map(
          (
            trackId // iterate over each track and display its cells
          ) => (
            <div key={trackId} className="sequencer-column">
              {stepIds.map((stepId) => {
                const id = `${trackId}-${stepId}`;
                return (
                  <label key={id} className="sequencer-cell">
                    <input
                      key={id}
                      id={id}
                      type="checkbox"
                      ref={(elm) => {
                        if (!elm) return;
                        if (!stepsRef.current[trackId]) {
                          stepsRef.current[trackId] = [];
                        }
                        stepsRef.current[trackId][stepId] = elm;
                      }}
                      className="sequencer-cell__input"
                    />
                    <div className="sequencer-cell-content" />
                  </label>
                );
              })}
            </div>
          )
        )}
        {/* </div> */}
      </div>
      <Button onClick={handleStartClick} className="play-button">
        {isPlaying ? 'Pause' : 'Start'}
      </Button>
    </section>
  );
}

export default Sequencer;
