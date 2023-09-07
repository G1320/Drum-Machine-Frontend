import './styles/App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import Create from './components/create';
import Read from './components/read';
import Update from './components/update';
import Show from './components/show';
import FourOhFour from './components/404';
import DrumMachine from './components/drum-Machine';
import Synth from './components/synth';
import Sequencer from './components/sequencer';
import Counter from './components/counter';
import { Provider } from 'react-redux';
import ErrorAlert from './components/error-alert';
import store from './store/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/create" />} />
          <Route path="/create" element={<Create />} />
          <Route path="/read" element={<Read />} />
          <Route path="/update" element={<Update />} />
          <Route path="/drum" element={<DrumMachine />} />
          <Route path="/synth" element={<Synth />} />
          <Route path="/sequencer" element={<Sequencer />} />
          <Route path="/pages/:pageName" element={<Show />} />
          <Route path="*" element={<FourOhFour />} /> {/* Catch-all route for 404 */}
        </Routes>
      </Router>
      <Counter />
      <ErrorAlert />
    </Provider>
  );
}

export default App;
