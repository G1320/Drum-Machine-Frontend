import './styles/App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Create from './components/create';
import Read from './components/read';
import Update from './components/update';
import Show from './components/show';
import FourOhFour from './components/404';
import DrumMachine from './components/drum-machine';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/create" />} />
          <Route path="/create" element={<Create />} />
          <Route path="/read" element={<Read />} />
          <Route path="/update" element={<Update />} />
          <Route path="/drum" element={<DrumMachine />} />
          <Route path="/pages/:pageName" element={<Show />} />
          <Route path="*" element={<FourOhFour />} /> {/* Catch-all route for 404 */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
