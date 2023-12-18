import React from 'react';
import ReactDOM from 'react-dom/client';

import store from './store/index.js';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
  // </React.StrictMode>
);
