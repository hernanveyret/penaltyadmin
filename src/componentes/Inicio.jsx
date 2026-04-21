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
            onClick={() => {
              borrarJuegosFinalizados()
              db && console.log(db[0]?.partidosFinalizados)
            }}
          >
            Resetear
          </button>
          </div>
        </nav>
      </main>
      
    </div>
  )
}
export default Inicio;