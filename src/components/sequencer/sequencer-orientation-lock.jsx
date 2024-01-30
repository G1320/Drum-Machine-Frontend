import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/sequencer/sequencer-orientation-lock.scss';
const OrientationLock = () => {
  // const [orientation, setOrientation] = useState(window.screen.orientation.type);

  // useEffect(() => {
  //   const handleOrientationChange = () => {
  //     // setOrientation(window.screen.orientation.type);
  //   };

  //   window.addEventListener('orientationchange', handleOrientationChange);

  //   return () => {
  //     window.removeEventListener('orientationchange', handleOrientationChange);
  //   };
  // }, []);

  return (
    <div className="orientation-lock">
      {/* {orientation.includes('portrait') && (
        <div>
          <p>Please rotate your device to landscape for the best experience.</p>
        </div>
      )} */}
    </div>
  );
};

export default OrientationLock;
