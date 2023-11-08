import React, { useState, useEffect, useRef, createRef } from 'react';
import * as Tone from 'tone';
import { Button } from '@mui/material';
// import { useSelector } from 'react-redux';
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

  const trackIds = [...Array(kitSounds.length).keys()];
  const stepIds = [...Array(numOfSteps).keys()];

  const tracksRef = useRef([]);
  const stepsRef = useRef([[]]);
  const lampsRef = useRef([]);
  const seqRef = useRef(null);

  const handleStartClick = async () => {
    if (Tone.Transport.state === 'started') {
      // console.log('Tone.Transport: ', Tone.Transport.state);
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const fetchKitSounds = async () => {
      try {
        const sounds = await getKitSounds(kitId);
        setKitSounds(sounds);
      } catch (error) {}
    };
    fetchKitSounds();
  }, [kitId, kitSounds]);

  useEffect(() => {
    stepsRef.current = Array.from(Array(numOfSteps)).map(() => {
      return Array.from(Array(tracksRef.current.length)).map(() => {
        return createRef();
      });
    });
    lampsRef.current = Array.from(Array(numOfSteps + 1)).map(() => {
      return { ref: createRef(), checked: false };
    });
    tracksRef.current = kitSounds.map((sample, i) => ({
      id: i,
      sampler: new Tone.Sampler({
        urls: {
          [NOTE]: sample.url,
        },
      }).toDestination(),
    }));
    seqRef.current = new Tone.Sequence(
      (time, step) => {
        tracksRef.current.map((trk) => {
          if (stepsRef.current[trk.id]?.[step]?.checked) {
            trk.sampler.triggerAttack(NOTE, time);
          }
        });
        console.log(step);
        lampsRef.current[step].checked = true;
        // console.log('seqRef: ', seqRef);
        // console.log('stepsRef: ', stepsRef);
        // console.log('tracksRef: ', tracksRef);
        // console.log('step: ', step);
        // console.log('seqRef.current: ', seqRef.current);
      },
      [...stepIds],
      '16n'
    );
    seqRef.current.start(0);

    return () => {
      seqRef.current?.dispose();
      tracksRef.current.map((trk) => void trk.sampler.dispose());
    };
  }, [kitSounds, numOfSteps]);

  return (
    <section className="sequencer">
      <div className="cell-list">
        {kitSounds.map((sample) => (
          <div key={sample._id}>
            <p>{sample.title}</p>
          </div>
        ))}
      </div>
      <div className="sequencer-lamp-row ">
        {stepIds.map((stepId) => (
          <label key={stepId} className="sequencer-lamp">
            <input
              type="radio"
              name="lamp"
              id={`lamp-${stepId}`}
              // disabled
              className="sequencer-lamp-input"
              // defaultChecked={false}

              ref={(elm) => {
                if (!elm) return;
                lampsRef.current[stepId] = elm;
              }}
            />
            <div className="sequencer-lamp-content" />
          </label>
        ))}
      </div>
      <div className="sequencer-row">
        {trackIds.map((trackId) => (
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
        ))}
      </div>
      <Button onClick={handleStartClick} className="play-button">
        {isPlaying ? 'Pause' : 'Start'}
      </Button>
    </section>
  );
}

export default Sequencer;
