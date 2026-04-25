import { useEffect, useState } from 'react';
import './mostrarNombres.css';

const MostrarNombres = ({
          setIsMostrarAnimacion,
}) => {

  return (
    <div className="contenedor-mostrar-nombre">
      <div className="cuadro nombre">        
          <p>HERNAN VEYRET</p>        
      </div>
      <div className="btn-cerrar">
          <button
            type='button'
            onClick={() => {
              setIsMostrarAnimacion(false);
            }}
          >X</button>
        </div>
    </div>
  )
}
export default MostrarNombres;