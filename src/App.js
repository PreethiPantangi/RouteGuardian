import React from 'react';
import './App.css';
import MapComponent from './MapComponent';
import HeatMap from './HeatMap';
import Header from './Header';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<MapComponent />} />
          <Route path="/heatMap" element={<HeatMap />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
