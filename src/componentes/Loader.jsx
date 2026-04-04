import React from 'react';
import './loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <img 
      src='/img/pelota.png' 
      alt="Cargando..." 
      className="spinner" />
    </div>
  );
};

export default Loader;