import React from 'react';
import { createRoot } from 'react-dom/client';
import '../styles/index.css';
import { LandingPage } from '../components/landing/LandingPage';
createRoot(document.getElementById('root')).render(<LandingPage />);
