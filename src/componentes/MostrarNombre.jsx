import { useEffect, useState } from 'react';
import './mostrarNombres.css';

const MostrarNombres = ({
          setIsMostrarAnimacion,
          jugadores,
          numIndex,
          setNumIndex,
}) => {

  return (
    <div className="contenedor-mostrar-nombre">
      <div className="cuadro-nombre">        
          <p>{numIndex !== null ? jugadores[numIndex].nombre : ''}</p>
      </div>
      <button
            type='button'
            onClick={() => {
              setNumIndex(null)
              setIsMostrarAnimacion(false);
            }}
          >X</button>
    </div>
  )
}
export default MostrarNombres;