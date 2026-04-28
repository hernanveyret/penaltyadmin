import { useState, useEffect, useRef } from 'react';
import MostrarNombres from './MostrarNombre';

const Mezclar = ({
            jugadores,
}) => {
const [ jugador, setJugador ] = useState(null);
const [ cantJugadores, setCantJugadores ] = useState(0);
const [ check, setCheck ] = useState(false);
const [ jugadoresSeleccionados, setJugadoresSeleccionados ] = useState([])
const [ isMostrarAnimacion, setIsMostrarAnimacion ] = useState(false)
const [ numIndex, setNumIndex ] = useState(null);
const repetidos = useRef([])

useEffect(() => {
  if(jugadores.length > 0){
    setCantJugadores(jugadores.length)
  }
},[jugadores])

const mezclar = (cantidad) => {
   const index = Math.floor(Math.random() * cantidad);
   return index
}

const probar = () => {

  if (repetidos.current.length === jugadores.length) {
    console.log("ya salieron todos")
    return
  }

  let index = mezclar(jugadores.length)
  //Si se repite vuelve a buscar.
  while (repetidos.current.includes(index)) {
    index = mezclar(jugadores.length)
  }
  
  repetidos.current.push(index)
  setJugadoresSeleccionados((prev) => [...prev, jugadores[index] ])
  setNumIndex(index)
  setIsMostrarAnimacion(true)
}


useEffect(() => {
  const handleMotion = (event) => {
    const { x, y, z } = event.accelerationIncludingGravity || {};

    const fuerza = Math.abs(x) + Math.abs(y) + Math.abs(z);
    
    if (fuerza > 40) {
     if (repetidos.current.length === jugadores.length) {
        console.log("ya salieron todos")
        return
      }
    
      let index = mezclar(jugadores.length)
      //Si se repite vuelve a buscar.
      while (repetidos.current.includes(index)) {
        index = mezclar(jugadores.length)
      }

      repetidos.current.push(index)
      setJugadoresSeleccionados((prev) => [...prev, jugadores[index] ])
      setNumIndex(index)
      setIsMostrarAnimacion(true)
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
            numIndex={numIndex}
            setNumIndex={setNumIndex}
          />
      }
      <button onClick={() => {
        probar()
        //setIsMostrarAnimacion(true)
        }}>CLICK</button>
      <p><span>Todos </span><input type='checkbox' name='check' onChange={(e) => setCheck(e.target.checked)} /></p>
      { check === true ? '' : <p><span>O ingrese una cantidad: </span><input type='number' /></p>}
      { <p>{jugador ? '' : 'Sacudi el celular para comenzar'}</p>}
      { jugadoresSeleccionados.length > 0 &&
         jugadoresSeleccionados.map((j, i )=> (         
          <p key={j.id} style={{color:'orangered'}}>#{i+1}-{j.nombre[0].toUpperCase() + j.nombre.slice(1) }</p>         
          ))          
      }
      {
        <p>{
          jugadoresSeleccionados.length > 0  &&
            jugadoresSeleccionados.length === jugadores.length && 'No hay mas Jugadores para sortear...'

          }</p>
      }
    </div>
  )
}
export default Mezclar;