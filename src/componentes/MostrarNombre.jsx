import { useEffect, useState } from 'react';
import './mostrarNombres.css';

const MostrarNombres = ({
          setIsMostrarAnimacion,
          jugadores,
          numIndex,
}) => {

  return (
    <div className="contenedor-mostrar-nombre">
      <div className="cuadro-nombre">        
          <p>{jugadores[numIndex].nombre}</p>        
      </div>
      <button
            type='button'
            onClick={() => {
              setIsMostrarAnimacion(false);
            }}
          >X</button>
    </div>
  )
}
export default MostrarNombres;