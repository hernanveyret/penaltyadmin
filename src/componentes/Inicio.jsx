import { useState, useEffect } from 'react';
import { cerrarSesion } from '../firebase/auth.js'
import CargarJugadores from './CargarJugadores';
import ListaJugadores from './ListaJugadores.jsx';
import PartidosTerminados from './PartidosTerminados.jsx';
import './inicio.css';
import Jugar from './Jugar.jsx';

const Inicio = ({ db, setDb }) => {
  const [ isCargarJugadores, setIsCargarJugadores ] = useState(true);
  const [ isListaDeJugadores, setIsListaDeJugadores ] = useState(false);
  const [ isJugar, setIsJugar ] = useState(false);
  const [ isPartidosterminados, setIsPartidosTerminados ] = useState(false);
  
  return (
    <div className='inicio-contenedor'>
      <header>
        <h1>PENALTY</h1>
        <div className="nav-config">
          <button
            type='button'
            className='btn-config'
            >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="#FFFFFF">
                <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/>
            </svg>
          </button>
          <button
            title='Salir'
            type='button'
            className='btn-salir'
            onClick={cerrarSesion}
            >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="#EA3323">
                <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"/>
            </svg>
          </button>
        </div>
      </header>
      <main>
        
          {
            isCargarJugadores &&
            <CargarJugadores 
              db={db}
              setDb={setDb}
            />
          }
          {
            isListaDeJugadores &&
              <ListaJugadores 
                db={db}
                setDb={setDb}
              />
          }
          {
            isJugar &&
              <Jugar 
                db={db}
                setDb={setDb}
              />
          }
          {
            isPartidosterminados &&
              <PartidosTerminados 
                db={db}
                setDb={setDb}
              />
          }
       
        <nav className='nav-abajo'>
          <button
            title='Agregar jugadores'
            type='button'
            onClick={() => {
              setIsPartidosTerminados(false);
              setIsJugar(false)
              setIsListaDeJugadores(false);
              setIsCargarJugadores(true);
            }}
          >
            Agregar jugadores
          </button>
          <button
            title='Jugar'
            type='button'
            className='btn-jugar'
            onClick={() => {
              setIsPartidosTerminados(false);
              setIsListaDeJugadores(false);
              setIsCargarJugadores(false);
              setIsJugar(true)
            }}
          >
            Jugar
          </button>
          <button
            title='Lista de jugadores'
            type='button'
            onClick={() => {
              setIsPartidosTerminados(false);
              setIsJugar(false)
              setIsCargarJugadores(false);
              setIsListaDeJugadores(true);
            }}
          >
            Lista de jugadores
          </button>
          <button
            title='Partidos finalizados'
            type='button'
            onClick={() => {
              setIsJugar(false)
              setIsListaDeJugadores(false);
              setIsCargarJugadores(false);
              setIsPartidosTerminados(true);
            }}
          >
            Partidos finalizados
          </button>
          <button
            type='button'
            className='btn-resetJuego'
          >
            Resetear
          </button>
        </nav>
      </main>
      
    </div>
  )
}
export default Inicio;