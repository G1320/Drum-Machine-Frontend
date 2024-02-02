import React, { useEffect } from 'react';
import './assets/styles/basic/app.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import About from './components/basic/about';
import Help from './components/basic/help';
import Header from './components/header/header';
import Create from './components/user/create-user';
import Read from './components/admin/read-users';
import Update from './components/user/update-user';
import CreateKit from './components/kits/create-kit';
import Show from './components/kits/edit-kit';
import FourOhFour from './components/basic/404';
import Synth from './components/synth/synth';
import DrumMachine from './components/drum-machine/drum-machine';
import Sequencer from './components/sequencer/sequencer';
import Login from './components/auth/login';

import ErrorAlert from './components/alerts/error-alert';
import SuccessAlert from './components/alerts/success-alert';

import { setAllSounds } from './slices/soundsSlice';
import { setSelectedKit } from './slices/kitsSlice';
import { getSounds } from './services/sound-service';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchAndSetInitialData() {
      const sounds = await getSounds();
      dispatch(setAllSounds(sounds));
      dispatch(setSelectedKit('6571e750ecffe8969f1e89ee'));
    }
    fetchAndSetInitialData();
  }, []);

  return (
    <>
      <Header />
      <main>
        <section className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/sequencer/id/6571e750ecffe8969f1e89ee" />} />
            <Route path="/create" element={<Create />} />
            <Route path="/read" element={<Read />} />
            <Route path="/update" element={<Update />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/create-kit" element={<CreateKit />} />
            <Route path="/create-kit/:userId" element={<CreateKit />} />
            <Route path="/drum" element={<DrumMachine />} />
            <Route path="/drum/id/:kitId" element={<DrumMachine />} />
            <Route path="/synth" element={<Synth />} />
            <Route path="/sequencer" element={<Sequencer />} />
            <Route path="/sequencer/id/:kitId" element={<Sequencer />} />
            <Route path="/pages/id/:kitId" element={<Show />} />
            <Route path="/pages/:pageName" element={<Show />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<FourOhFour />} />
          </Routes>
        </section>
        <ErrorAlert />
        <SuccessAlert />
      </main>
    </>
  );
}

export default App;
