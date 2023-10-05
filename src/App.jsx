import React, { useEffect } from 'react';
import './styles/App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Cookies from 'js-cookie';
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';

import About from './components/about';
// import NotAvailable from './components/not-available';
import Header from './components/header';
import Create from './components/create';
import Read from './components/read';
import Update from './components/update';
import Show from './components/show';
import FourOhFour from './components/404';
import DrumMachine from './components/drum-Machine';
import Synth from './components/synth';
import Sequencer from './components/sequencer';
import CreateKit from './components/create-kit';
import Login from './components/login';
// import User from './components/user';
import ErrorAlert from './components/error-alert';
import SuccessAlert from './components/success-alert';
import { getUserDetails } from './services/auth-service';
import { getLocalUser } from './services/user-service';

import store from './store/store';
import { login as loginAction } from './slices/authSlice';

function App() {
  // const dispatch = useDispatch();

  useEffect(() => {
    const user = getLocalUser();
    console.log('user: ', user);
    // if (user) {
    //   // dispatch(loginAction(user));
    // }
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
          {/* <Route path="/user" element={<User />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<FourOhFour />} />
        </Routes>
      </Router>
      <ErrorAlert />
      <SuccessAlert />
    </Provider>
  );
}

export default App;
