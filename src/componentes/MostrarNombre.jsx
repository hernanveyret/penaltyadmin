import { useEffect, useState } from 'react';
import './mostrarNombres.css';

const MostrarNombres = ({
          setIsMostrarAnimacion,
          jugadores,
}) => {

  return (
    <div className="contenedor-mostrar-nombre">
      <div className="cuadro-nombre">        
          <p>HERNAN VEYRET</p>        
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