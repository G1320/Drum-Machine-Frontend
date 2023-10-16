import React, { useEffect } from 'react';
import './assets/styles/basic/app.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';

import About from './components/basic/about';
import Header from './components/header/header';
import Create from './components/user/create-user';
import Read from './components/admin/read-users';
import Update from './components/user/update-user';
import Show from './components/kits/show-kit';
import FourOhFour from './components/basic/404';
import DrumMachine from './components/drum-machine/drum-Machine';
import Synth from './components/synth/synth';
import Sequencer from './components/sequencer/sequencer';
import CreateKit from './components/kits/create-kit';
import KitFilter from './components/kits/kit-filter';
import Login from './components/auth/login';

import ErrorAlert from './components/alerts/error-alert';
import SuccessAlert from './components/alerts/success-alert';
import { getLocalUser } from './services/user-service';

import store from './store/index';

function App() {
  useEffect(() => {
    const user = getLocalUser();
    console.log('user: ', user);
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/create" />} />
          <Route path="/create" element={<Create />} />
          <Route path="/read" element={<Read />} />
          <Route path="/update" element={<Update />} />
          <Route path="/about" element={<About />} />
          <Route path="/drum" element={<DrumMachine />} />
          <Route path="/synth" element={<Synth />} />
          <Route path="/sequencer" element={<Sequencer />} />
          <Route path="/makekit" element={<CreateKit />} />
          <Route path="/pages/id/:pageId" element={<Show />} />
          <Route path="/pages/:pageName" element={<Show />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<FourOhFour />} />
        </Routes>
        <KitFilter />
      </Router>
      <ErrorAlert />
      <SuccessAlert />
    </Provider>
  );
}

export default App;
