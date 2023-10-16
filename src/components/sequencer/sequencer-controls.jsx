import React from 'react';

function Controls({ envelope, setEnvelope, effects, setEffects }) {
  return (
    <div>
      {/* Envelope Controls */}
      <div>
        <label>
          Attack:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={envelope.attack}
            onChange={(e) => setEnvelope({ ...envelope, attack: parseFloat(e.target.value) })}
          />
          <span>{envelope.attack}</span>
        </label>
      </div>
      <div>
        <label>
          decay:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={envelope.decay}
            onChange={(e) => setEnvelope({ ...envelope, decay: parseFloat(e.target.value) })}
          />
          <span>{envelope.attack}</span>
        </label>
      </div>

      {/* Effects Controls */}
      <div>
        <label>
          Delay:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={effects.delay}
            onChange={(e) => setEffects({ ...effects, delay: parseFloat(e.target.value) })}
          />
          <span>{effects.delay}</span>
        </label>
      </div>
    </div>
  );
}

export default Controls;
