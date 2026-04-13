import { useState, useEffect, useRef } from 'react'
import { crearPartidas, borrarPartidas, checkGanador, borrarJugador, agregarPartidosFinalizados } from '../firebase/auth.js'
import Loader from './Loader.jsx'
import './jugar.css'

const Jugar = ({ db, setDb }) => {
const [ jugadores, setJugadores ] = useState([])
const [ equipos, setEquipos ] = useState(db[0]?.equipos ? db[0].equipos : [] )
const [ isLoader, setIsLoader ] = useState(false)
const [ juegosFinalizados, setJuegosFinalizados ] = useState(db[0]?.partidosFinalizados ? db[0]?.partidosFinalizados : []);
const [ cantidadDePartidos, setCantidadDePartidos ] = useState({});

useEffect(() => {
  if(db){
    const filtro = db[0]?.jugadores
    setJugadores(filtro)
    setEquipos(db[0]?.equipos)
    setJuegosFinalizados(db[0]?.partidosFinalizados || [])
      
  }
},[db])

useEffect(() => {
  if(db){
    const estadoInicial = {}
    equipos.forEach((_, i) => {
    estadoInicial[`partido-${i+1}`] = true
  })
  setCantidadDePartidos(estadoInicial)  
  }
},[])

useEffect(() => {
  equipos && console.log(equipos)
},[equipos])



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

const crearEquipos = async () => {
if(jugadores.length === 0) return
if(jugadores.length % 2 !== 0) {
  alert('Faltan jugadores');
  return
}
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

const anularPartidos = async () => {
  console.log('click')
  try {
    console.log('click 2')
    setEquipos([])
    await borrarPartidas();
    console.log('Partidas anuladas')
    
  } catch (error) {
    console.log('no se pudo anular la partida')
  }
}
const marcarGanador = async ({ ganadorId, perdedorId }) => {
  try {
    const nuevosEquipos = equipos.map((equipo) => {
      // Aseguramos que jugadores sea un array
      const jugadores = Array.isArray(equipo.jugadores) ? equipo.jugadores : []

      // Filtramos cualquier elemento undefined y actualizamos el estado
      const nuevosJugadores = jugadores
        .filter(Boolean) // elimina jugadores undefined
        .map((jugador) => {
          if (jugador.id === ganadorId) return { ...jugador, estado: true }
          if (jugador.id === perdedorId) return { ...jugador, estado: false }
          return jugador
        })

      return { ...equipo, jugadores: nuevosJugadores }
    })

    // Actualizamos el state
    setEquipos(nuevosEquipos)

    // Llamamos a tu función checkGanador
    await checkGanador(nuevosEquipos)

  } catch (error) {
    console.error('Error al marcar ganador:', error)
  }
}

const finalizarRonda = async () => {

  if(db){
    const estadoInicial = {}
    equipos.forEach((_, i) => {
    estadoInicial[`partido-${i+1}`] = true
  })
  setCantidadDePartidos(estadoInicial)  
  }
  
  setJuegosFinalizados(prev => [...prev, equipos]);
  setIsLoader(true)
  const perdedores = equipos.flatMap(e => e.jugadores).filter(j => j.estado === false).map(j => j.id);  
  const resetJugadores = jugadores.filter(j => !perdedores.includes(j.id))
  try {
    setEquipos([])
     await agregarPartidosFinalizados(equipos)
     await borrarPartidas()
     await borrarJugador(resetJugadores);
     setIsLoader(false)
    // console.log('se borraron todos los equipos')
   } catch (error) {
    setIsLoader(false)
    console.log('Error al borrar los equipos')
   }
}

const bloquearPartido = (partido) => {
  const inputs = document.querySelectorAll(`[name^="${partido}"]`)
  inputs.forEach(check => {
    check.disabled = !check.disabled
  })
  setCantidadDePartidos(prev => ({
    ...prev,
    [partido]: !prev[partido]
  }))
}

return (
  <div className="contenedor-jugar">
    { isLoader && <Loader /> }
    <h2>JUGAR</h2>
    { equipos.length > 8 
      ?
      <h3 style={{ color:'green', backgroundColor:'white', padding: '5px 30px', borderRadius: '5px', marginBottom: '10px'}}>ELIMINATORIAS</h3>
      :
      equipos.length === 8 
      ?
      <h3 style={{ color:'green', backgroundColor:'white', padding: '5px 30px', borderRadius: '5px', marginBottom: '10px'}}>OCTAVOS DE FINAL</h3>
      :
      equipos.length === 4 
      ?
      <h3 style={{ color:'green', backgroundColor:'white', padding: '5px 30px', borderRadius: '5px', marginBottom: '10px'}}>CUARTOS FINAL</h3>
      :
      equipos.length === 2 
      ?
      <h3 style={{ color:'green', backgroundColor:'white', padding: '5px 30px', borderRadius: '5px', marginBottom: '10px'}}>SEMI FINAL</h3>
      :
      equipos.length === 1
      ?
      <h3 style={{ color:'green', backgroundColor:'white', padding: '5px 30px', borderRadius: '5px', marginBottom: '10px'}}>FINAL</h3>
      : (
        <div className='nav-btn-crearPartidas'>
      <button 
        title='Crear equipos'
        type='button'
        className='btn-crear-equipos'
        onClick={crearEquipos}
      >
        Crear partidos
      </button> 
      <button
        title='Crear Repechaje'
        type='button'
        className='btn-crear-equiposEnganchados'      
        onClick={() => { 
          crearEnganchados()
        }}
      >
        Enganchados
      </button>
      </div>
      )
       
    }    
    <section className='listadeequipos'>
      { equipos.map((equipo, i) => (
        <div className="card" key={i}          
        >          
          <div className="title-card">
            <p>Partido {i+1}</p>
            <button
              type='button'
              className='btn-bloqueo-partido'
              onClick={() => bloquearPartido(`partido-${i+1}`)}
            >
              {
                cantidadDePartidos[`partido-${i+1}`] ?(
                  <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#75FB4C">
                  <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm485-75q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-285-85Z"/>
              </svg>
                ): (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                height="24px" 
                viewBox="0 -960 960 960" 
                width="24px" 
                fill="#EA3323">
                  <path d="M280-240q-100 0-170-70T40-480q0-100 70-170t170-70h400q100 0 170 70t70 170q0 100-70 170t-170 70H280Zm0-80h400q66 0 113-47t47-113q0-66-47-113t-113-47H280q-66 0-113 47t-47 113q0 66 47 113t113 47Zm85-75q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm115-85Z"/>
              </svg>
                ) 
             }
              
            </button>
          </div>
          <div className='info-nombre'>
            { equipo.jugadores.map((jugador, index) => (
              <label key={jugador?.id || index}>
                <span>
                  <p>
                    {jugador?.apellido === '' ? '' : jugador?.apellido?.[0]?.toUpperCase() + jugador?.apellido?.slice(1)}{" "}
                    {jugador?.nombre === '' ? '' : jugador?.nombre?.[0]?.toUpperCase() + jugador?.nombre?.slice(1)}
                  </p>
                  <input
                    className='check-jugador'
                    type='checkbox'
                    name={`partido-${i+1}`}
                    onChange={(e) => marcarGanador(
                      { 
                        ganadorId: jugador?.id,
                        estadoGanador: e.target.checked,
                        perdedorId: equipo.jugadores[index === 0 ? 1 : 0]?.id,
                        estadoPerdedor: false
                      }
                    )}
                  />
                  {
                    jugador?.estado ?                                                            
                     <img
                      src='./img/pelota.png'
                      alt='pelota'
                      className='pelota-check'
                      />
                      :
                       ''                    
                  }                  
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </section>
    <div className="contenedor-btn-jugar">
        <button
          title='Boton eliminar ronda'
          type='button'
          className='btn-reset-jugada'
          onClick={() => {
            anularPartidos()
          }}
        >
          Anular ronda
        </button>
        <button 
        title='Finalizar partida'
        type='button'
        className='btn-crear-equipos'
        onClick={finalizarRonda}
        >
        Finalizar ronda
      </button>      
    </div>
  </div>
)
}
export default Jugar;
//name={`jugador-${equipo.equipo}-${index}`}