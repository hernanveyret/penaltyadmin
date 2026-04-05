import { useState, useEffect, useRef  } from "react";
import { agregarJugador } from '../firebase/auth.js'
import Loader from "./Loader.jsx";
import './cargarJugadores.css'

const CargarJugadores = ({ db, setDb}) => {
  const inputNombreRef = useRef(null);
  const [ nombre, setNombre ] = useState('')
  const [ apellido, setApellido ] = useState('')
  const [ isLoader, setIsLoader ] = useState(false);
  
const cargar = async (e) => {
  e.preventDefault();
  setIsLoader(true)
  const nuevoJugador = {
    id: Date.now(),
    nombre: (nombre || '').toLowerCase(),
    apellido: (apellido || '').toLowerCase(),
    estado:false
  };

  setDb(prev => 
    prev.map((item, index) => 
      index === 0 
        ? { 
            ...item, 
            jugadores: [...item.jugadores, nuevoJugador] 
          } 
        : item
    )
  );
   
 try {
   // Resetear formulario
  setNombre('');
  setApellido('');
   await agregarJugador(nuevoJugador)
   setIsLoader(false)
   inputNombreRef.current.focus()
 } catch (error) {
  setIsLoader(false)
  console.log('No se pudo cargar al jugador')
 }
};

  return (
    <div className="formularioLogin">
      { isLoader && <Loader /> }
        <h3>Cargar jugadores</h3>
        <form
          onSubmit={cargar}
        >
          <input  value={nombre}  ref={inputNombreRef} name='nombre' placeholder='Nombre' onChange={(e) => setNombre(e.target.value)}/>
          <input   value={apellido}name='apellido' placeholder='Apellido' onChange={(e) => setApellido(e.target.value)}/>
          <button type='submit'>CARGAR</button>
        </form>
    </div>
  )
}
export default CargarJugadores;