import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

function PlayButton() {
  return (
    <div className="play-button">
      <FontAwesomeIcon icon={faPlus} />
    </div>
  );
}

export default PlayButton;
