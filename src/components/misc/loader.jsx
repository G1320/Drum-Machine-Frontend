import React from 'react';
import { CircularProgress } from '@mui/material';
import '../../assets/styles/components/misc/loader.scss';

function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <CircularProgress style={{ color: '#834de7' }} />
      </div>
    </div>
  );
}

export default Loader;
