import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import '../styles/synthKeys.css';
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const synthKeys = () => {
  const [activeNote, setActiveNote] = useState(null);
  const synth = new Tone.PolySynth().toDestination();

  const playNote = (note) => {
    setActiveNote(note);
    synth.triggerAttack(note);
  };

  const stopNote = (note) => {
    setActiveNote(null);
    synth.triggerRelease(note);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (notes.includes(e.key.toUpperCase())) {
        playNote(`${e.key.toUpperCase()}4`);
      }
    };

    const handleKeyUp = (e) => {
      if (notes.includes(e.key.toUpperCase())) {
        stopNote(`${e.key.toUpperCase()}4`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="keyboard">
      {notes.map((note, index) => {
        const isSharp = note.includes('#');
        return (
          <div
            key={note}
            className={`key ${isSharp ? 'sharp' : 'natural'} ${
              activeNote === note + '4' ? 'active' : ''
            }`}
            onMouseDown={() => playNote(`${note}4`)}
            onMouseUp={() => stopNote(`${note}4`)}
          >
            {note}
          </div>
        );
      })}
    </div>
  );
};

export default synthKeys;
