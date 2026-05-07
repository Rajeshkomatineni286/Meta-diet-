import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { ErrorBoundary } from './ErrorBoundary';
import '../styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <ErrorBoundary>
      <App />
      <Toaster position='bottom-center' />
    </ErrorBoundary>
  </HashRouter>
);
