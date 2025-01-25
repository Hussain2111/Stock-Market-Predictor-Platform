import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import Home from './Home';
import Account from './Account';
import Analysis from './analysis';
import { Routes, Route } from 'react-router-dom';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/analysis" element={<Analysis />} />
      </Routes>
    </Router>
  </StrictMode>,
);