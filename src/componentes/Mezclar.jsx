import { useState, useEffect } from 'react';
import MostrarNombres from './MostrarNombre';

const Mezclar = ({
            jugadores,
}) => {
const [ jugador, setJugador ] = useState(null);
const [ cantJugadores, setCantJugadores ] = useState(0);
const [ check, setCheck ] = useState(false);
const [ jugadoresSeleccionados, setJugadoresSeleccionados ] = useState([])
const [ isMostrarAnimacion, setIsMostrarAnimacion ] = useState(false)

useEffect(() => {
  if(jugadores.length > 0){
    setCantJugadores(jugadores.length)
  }
},[jugadores])
useEffect(() => {
  jugadores && console.log(jugadores)

})
useEffect(() => {
  console.log(cantJugadores)
},[cantJugadores])
useEffect(() => {
  console.log(check)
},[check])

useEffect(() => {
  const handleMotion = (event) => {
    const { x, y, z } = event.accelerationIncludingGravity || {};

    const fuerza = Math.abs(x) + Math.abs(y) + Math.abs(z);

    if (fuerza > 30) {
      console.log("Sacudiste el dispositivo!");
      setIsMostrarAnimacion(true);
    }
  };

  window.addEventListener("devicemotion", handleMotion);

  return () => {
    window.removeEventListener("devicemotion", handleMotion);
  };
}, []);

  return (
    <div className="contenedor-mezclar">
      {
        isMostrarAnimacion &&
          <MostrarNombres 
            setIsMostrarAnimacion={setIsMostrarAnimacion}
            jugadores={jugadores}
          />
      }
      <button onClick={() => setIsMostrarAnimacion(true)}>CLICK</button>
      <p><span>Todos </span><input type='checkbox' name='check' onChange={(e) => setCheck(e.target.checked)} /></p>
      { check === true ? '' : <p><span>O ingrese una cantidad: </span><input type='number' /></p>}
      { <p>{jugador ? '' : 'Sacudi el celular para comenzar'}</p>}
       { 
        jugadoresSeleccionados.length > 0
          ?
            <p>Hay { jugadoresSeleccionados.length } seleccionados</p>
          :
          <p>No hay jugadores seleccionados</p>
       }
    </div>
  )
}
export default Mezclar;