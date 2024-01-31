import React from 'react';
import ReactDOM from 'react-dom/client';

import store from './store/index.js';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

// Query V3
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
// Query V4 / V5
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App.jsx';
import './index.scss';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
      {/* <ReactQueryDevtools initialIsOpen /> */}
    </QueryClientProvider>
  </Provider>
  // </React.StrictMode>
);
