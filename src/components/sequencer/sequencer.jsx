import React, { useState, useEffect, useRef, createRef } from 'react';
import * as Tone from 'tone';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import SequencerPad from './sequencer-pad';
import { getKitSounds, updateKitSounds } from '../../services/kit-service';
import '../../assets/styles/components/sequencer/sequencer.css';
import SoundsList from '../sounds/sounds-list';

function Sequencer() {
  const numOfSteps = 16;
  const NOTE = 'C2';
  const { kitId } = useParams();
  const [kitSounds, setKitSounds] = useState([]);
  const [updatedKit, setUpdatedKit] = useState(null); // Define updatedKit variable

  const [numOfSounds, setNumOfSounds] = useState(0); // add state variable for number of sounds

  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);

  const trackIds = [...Array(kitSounds.length).keys()];
  const stepIds = [...Array(numOfSteps).keys()];

  const tracksRef = useRef([]);
  const stepsRef = useRef([...Array(kitSounds.length)].map(() => Array(numOfSteps).fill(null)));
  const lampsRef = useRef([]);
  const seqRef = useRef(null);

  const handleStartClick = async () => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      lampsRef.current[0].checked = true;
      Tone.Transport.bpm.value = 120;
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const getSounds = async () => {
      try {
        const sounds = await getKitSounds(kitId);
        setKitSounds(sounds);
        setNumOfSounds(sounds.length); // Used to trigger a render of the sequencer when a sound is added or removed
      } catch (error) {
        console.error('Failed to load kit', error);
      }
    };
    getSounds();
  }, [kitId, kitSounds]);

  // useEffect(() => {
  //   const pattern = JSON.parse(localStorage.getItem('pattern'));
  //   if (pattern) {
  //     setSelectedCells(pattern);
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('pattern', JSON.stringify(selectedCells));
  // }, [selectedCells]);

  useEffect(() => {
    stepsRef.current = Array.from(Array(kitSounds)).map(() => {
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const newKitSounds = Array.from(kitSounds);
    const [reorderedSound] = newKitSounds.splice(result.source.index, 1);
    newKitSounds.splice(result.destination.index, 0, reorderedSound);

    try {
      const updatedKit = await updateKitSounds(kitId, newKitSounds);
      setUpdatedKit(updatedKit);
    } catch (error) {
      console.error(error);
      setKitSounds(newKitSounds);
    }
  };

  return (
    <>
      <section className="sequencer">
        <div className="sequencer-lamp-row ">
          {stepIds.map(
            (
              stepId // iterate over each step and display a lamp
            ) => (
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
                <div className="sequencer-lamp-content" />
              </label>
            )
          )}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="kitSounds">
            {(provided) => (
              <ul
                key={'sounds'}
                className="cell-list"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {kitSounds.map((sound, index) => (
                  <Draggable key={sound._id} draggableId={sound._id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={sound._id}
                      >
                        {sound.title}
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        <div className="sequencer-column">
          {trackIds.map(
            (
              trackId // iterate over each track and display its cells
            ) => (
              <div key={trackId} className="sequencer-row my-sequencer-row ">
                {stepIds.map((stepId) => {
                  const id = `${trackId}-${stepId}`;
                  const isSelected = selectedCells.includes(id);

                  return (
                    <div key={id}>
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
                        // disabled={isPlaying}
                        ref={(el) => {
                          if (!el) return;
                          if (!stepsRef.current[trackId]) {
                            stepsRef.current[trackId] = [];
                          }
                          stepsRef.current[trackId][stepId] = el;
                        }}
                      />
                      <div />
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>
        <Button onClick={handleStartClick} className="play-button">
          {isPlaying ? 'Pause' : 'Start'}
        </Button>
      </section>
      <SoundsList kitId={kitId} />
    </>
  );
}

export default Sequencer;
