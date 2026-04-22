import { useState, useEffect } from 'react';
import { cerrarSesion, borrarJuegosFinalizados, crearPartidas, agregarRepechajes } from '../firebase/auth.js'
import CargarJugadores from './CargarJugadores';
import ListaJugadores from './ListaJugadores.jsx';
import PartidosTerminados from './PartidosTerminados.jsx';
import Menu from './Menu.jsx';
import './inicio.css';
import Jugar from './Jugar.jsx';

const Inicio = ({ 
      db, 
      setDb, 
      jugadores, 
      setJugadores, 
      juegosFinalizados, 
      setJuegosFinalizados, 
      equipos, 
      setEquipos 
    }) => {
  const [ isCargarJugadores, setIsCargarJugadores ] = useState(false);
  const [ isListaDeJugadores, setIsListaDeJugadores ] = useState(false);
  const [ isJugar, setIsJugar ] = useState(false);
  const [ isPartidosterminados, setIsPartidosTerminados ] = useState(false);
  const [ openMenu, setOpenMenu ] = useState(false);
  const [ isLoader, setIsLoader ] = useState(false);

  const crearEquipos = async () => {
if(jugadores.length === 0) return
if(jugadores.length % 2 !== 0) {
  alert('Faltan jugadores');
  return
}

//const jugadoresAleatorios = mezclar(jugadores)

  const nuevosEquipos = []
  for (let i = 0; i < jugadores.length; i += 2) {
    nuevosEquipos.push({
      partido: nuevosEquipos.length + 1,
      jugadores: [jugadores[i], jugadores[i + 1]]
    })
  }
  try {
    setEquipos(nuevosEquipos)    
     await crearPartidas(nuevosEquipos)
     console.log('equipos cargados en la base de datos con exito')
     setIsLoader(false)
   } catch (error) {
    setIsLoader(false)
    console.log('No se pudo cargar al jugador')
   }

}

const crearEnganchados = async () => {  
  const cantidadJugadores = jugadores.length
  const mitadDeJugadores = cantidadJugadores / 2
  const stepUno = jugadores.slice(0,mitadDeJugadores)
  const stepDos = jugadores.slice(mitadDeJugadores, cantidadJugadores)
 
  let enganchados = [];
  if( stepUno > stepDos){
    for(let i=0; i < stepUno.length; i++){
      enganchados.push({
        partido: enganchados.length + 1,
        jugadores: [stepUno[i], stepDos[i]]
      })
    }
  }else{
    for(let i=0; i < stepDos.length; i++){
      enganchados.push({
        partido: enganchados.length + 1,
        jugadores: [stepUno[i], stepDos[i]]
      })
    }
  }
  
  try {
    setEquipos(enganchados)    
     await crearPartidas(enganchados)
     console.log('equipos cargados en la base de datos con exito')
     setIsLoader(false)
   } catch (error) {
    setIsLoader(false)
    console.log('No se pudo cargar al jugador')
   }
}

const generarNumeroRandom = (numero, veces) => {
  let cantVeces = veces * 2
  const indices = []
  for(let i = 0; i < cantVeces; i++ ){
    const numeroIndice = Math.floor(Math.random() * numero) + 1;
    if(!indices.includes(numeroIndice)){
        indices.push(numeroIndice)
    }else{
      console.log('repetido')
     cantVeces = cantVeces + 1     
    }
  }
  return indices
}

const crearRepechaje = async () => {
/*
  if(db){
    const filtro = db[0]?.repechajes
    console.log(filtro)
    setEquipos(filtro)
    return
  }
  */
  let cantidadJugadores = prompt("Ingresá cuantos jugadores necesitas borrar");
  let totalJugadores = prompt("Ingresá la cantidad de jugadores totales");
  console.log(generarNumeroRandom(totalJugadores,cantidadJugadores))
  const indices = generarNumeroRandom(totalJugadores,cantidadJugadores)
  console.log('Indices: ',indices)
  let filtro = []
  for( let i = 0; i < indices.length; i++ ){
    filtro.push(jugadores[i])
  }
  console.log(filtro)

  const equiposRepechaje = []
  for(let i=0; i < filtro.length; i+=2){
      equiposRepechaje.push({
        partido: i,
        jugadores: [filtro[i], filtro[i+1]]
      })
    }
    try {
      await agregarRepechajes(equiposRepechaje)
      setEquipos(equiposRepechaje)
  } catch (error) {
    console.log('No se guardaron los equipos para repechaje')
  }
}

  
  return (
    <div className='inicio-contenedor'>
      <header>
        <h1>PENALES 11 FC</h1>
        <div className="nav-menu">
          <button
            type='button'
            className='btn-menu'
            onClick={() => setOpenMenu((prev) => !prev)}
            >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="#FFFFFF">
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
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
      <nav className='nav-menu-inicio'>
        { openMenu && 
          <Menu 
            jugadores={jugadores}
            crearEquipos={crearEquipos}
            setOpenMenu={setOpenMenu}
            crearEnganchados={crearEnganchados}
            crearRepechaje={crearRepechaje}
          /> }
      </nav>
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
                jugadores={jugadores}
                setJugadores={setJugadores}
                equipos={equipos}
                setEquipos={setEquipos}
                setJuegosFinalizados={setJuegosFinalizados}
                juegosFinalizados={juegosFinalizados}
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
          <div className="contenedorMenu">
          <button
            title='Agregar jugadores'
            type='button'
            className='btn-juego'
            onClick={() => {
              setOpenMenu(false)
              setIsPartidosTerminados(false);
              setIsJugar(false)
              setIsListaDeJugadores(false);
              setIsCargarJugadores(true);
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="#FFFFFF">
                <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-640Zm0 400Z"/>
            </svg>
          </button>

                 <button
            title='Lista de jugadores'
            type='button'
            className='btn-juego'
            onClick={() => {
              setOpenMenu(false)
              setIsPartidosTerminados(false);
              setIsJugar(false)
              setIsCargarJugadores(false);
              setIsListaDeJugadores(true);
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="#FFFFFF">
                <path d="M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z"/>
            </svg>
          </button>

          <button
            title='Jugar'
            type='button'
            className='btn-jugar'
            onClick={() => {
              setOpenMenu(false)
              setIsPartidosTerminados(false);
              setIsListaDeJugadores(false);
              setIsCargarJugadores(false);
              setIsJugar(true)
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="#FFFFFF">
                <path d="m414-168 12-56q3-13 12.5-21.5T462-256l124-10q13-2 24 5t16 19l16 38q39-23 70-55.5t52-72.5l-12-6q-11-8-16-19.5t-2-24.5l28-122q3-12 12.5-20t21.5-10q-5-25-12.5-48.5T764-628q-9 5-19.5 4.5T726-630l-106-64q-11-7-16-19t-2-25l8-34q-31-14-63.5-21t-66.5-7q-14 0-29 1.5t-29 4.5l30 68q5 12 2.5 25T442-680l-94 82q-10 9-23.5 10t-24.5-6l-92-56q-23 38-35.5 81.5T160-480q0 16 4 52l88-8q14-2 25.5 4.5T294-412l48 114q5 12 2.5 25T332-252l-38 32q27 20 57.5 33t62.5 19Zm72-172q-13 2-24-5t-16-19l-54-124q-5-12-1.5-25t13.5-21l102-86q9-9 22-10t24 6l112 66q11 7 17 19t3 25l-32 130q-3 13-12 21.5T618-352l-132 12Zm-6 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"/>
            </svg>
          </button>
   
          <button
            title='Partidos finalizados'
            type='button'
            className='btn-juego'
            onClick={() => {
              setOpenMenu(false)
              setIsJugar(false)
              setIsListaDeJugadores(false);
              setIsCargarJugadores(false);
              setIsPartidosTerminados(true);
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="#FFFFFF">
                <path d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160Zm0-80h640v-560H160v560Zm40-80h200v-80H200v80Zm382-80 198-198-57-57-141 142-57-57-56 57 113 113Zm-382-80h200v-80H200v80Zm0-160h200v-80H200v80Zm-40 400v-560 560Z"/>
            </svg>
          </button>
          <button
            type='button'
            className='btn-juego'      
            onClick={() => {
              setOpenMenu(false)
              borrarJuegosFinalizados()
              db && console.log(db[0]?.partidosFinalizados)
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              height="24px" 
              viewBox="0 -960 960 960" 
              width="24px" 
              fill="#FFFFFF">
                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
            </svg>
          </button>
          </div>
        </nav>
      </main>
      
    </div>
  )
}
export default Inicio;