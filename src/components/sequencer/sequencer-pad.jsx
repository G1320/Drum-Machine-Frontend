import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import '../../assets/styles/components/sequencer/sequencer-pad.css';

function SequencerPad({ id, sampleUrl, sampleName }) {
  return (
    <label className="sequencer-track">
      <input id={id} type="checkbox"></input>
      {/* <p>{sampleName}</p> */}
    </label>
  );
}

export default SequencerPad;
