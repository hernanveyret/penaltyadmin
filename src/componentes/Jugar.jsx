import { useState, useEffect, useRef } from 'react'
import { crearPartidas, borrarPartidas, checkGanador, borrarJugador, agregarPartidosFinalizados } from '../firebase/auth.js'
import Loader from './Loader.jsx'
import './jugar.css'

const Jugar = ({ db, setDb }) => {
const [ jugadores, setJugadores ] = useState([])
const [ equipos, setEquipos ] = useState(db[0]?.equipos ? db[0].equipos : [] )
const [ isLoader, setIsLoader ] = useState(false)
const [ juegosFinalizados, setJuegosFinalizados ] = useState(db[0]?.partidosFinalizados ? db[0]?.partidosFinalizados : [])

useEffect(() => {
  if(db){
    const filtro = db[0]?.jugadores
    setJugadores(filtro)
    setEquipos(db[0]?.equipos)
    setJuegosFinalizados(db[0]?.partidosFinalizados || [])
  }
},[db])


const crearEquipos = async () => {
if(jugadores.length === 0) return

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
      :
      <button 
        title='Crear equipos'
        type='button'
        className='btn-crear-equipos'
        onClick={crearEquipos}
      >
        Crear partidos
      </button>  
    }    
    
    <section className='listadeequipos'>
      { equipos.map((equipo, i) => (

        <div className="card" key={i} >
          
          <div className="title-card">
            <p>Partido {equipo.equipo}</p>
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
                    name={`jugador-${equipo.equipo}-${index}`}
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
      <button 
      title='Finalizar partida'
      type='button'
      className='btn-crear-equipos'
      onClick={finalizarRonda}
    >
      Finalizar ronda
    </button>
  </div>
)

}

export default Jugar