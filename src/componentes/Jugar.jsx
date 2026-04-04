import { useState, useEffect } from 'react'
import { crearPartidas, borrarPartidas, checkGanador } from '../firebase/auth.js'
import Loader from './Loader.jsx'
import './jugar.css'

const Jugar = ({ db, setDb }) => {
const [ jugadores, setJugadores ] = useState([])
const [ equipos, setEquipos ] = useState(db[0]?.equipos ? db[0].equipos : [] )

useEffect(() => {
  if(db){
    const filtro = db[0]?.jugadores
    setJugadores(filtro)
  }
},[db])

const crearEquipos = async () => {
if(jugadores.length === 0) return

  const nuevosEquipos = []

  for (let i = 0; i < jugadores.length; i += 2) {
    nuevosEquipos.push({
      equipo: nuevosEquipos.length + 1,
      jugadores: [jugadores[i], jugadores[i + 1]]
    })
  }

  try {
    setEquipos(nuevosEquipos)    
     await crearPartidas(nuevosEquipos)
     console.log('equipos cargados en la base de datos con exito')
     //setIsLoader(false)
   } catch (error) {
    //setIsLoader(false)
    console.log('No se pudo cargar al jugador')
   }

}

useEffect(() => {
  console.log(equipos)
},[equipos])

/*
const marcarGanador = async ({ ganadorId, perdedorId }) => {
  console.log(ganadorId, perdedorId)
  const nuevosEquipos = equipos.map((equipo) => {
    const nuevosJugadores = equipo.jugadores.map((jugador) => {
      console.log(jugador.id)
      if (jugador.id == ganadorId) {
        return { ...jugador, estado: true }
      }

      if (jugador.id == perdedorId) {
        return { ...jugador, estado: false }
      }

      return jugador
    })

    return {
      ...equipo,
      jugadores: nuevosJugadores
    }

  })
  try {
    setEquipos(nuevosEquipos)
    await checkGanador(nuevosEquipos)    
  } catch (error) {
    console.log('error al marcar ganador')
  }
}
*/

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
  console.log('Finalizar ronda')
  try {
    setEquipos([])
     await borrarPartidas()
     console.log('se borraron todos los equipos')
     //setIsLoader(false)
   } catch (error) {
    //setIsLoader(false)
    console.log('Error al borrar los equipos')
   }
}

return (
  <div className="contenedor-jugar">

    <h2>JUGAR</h2>
    <button 
      title='Crear equipos'
      type='button'
      className='btn-crear-equipos'
      onClick={crearEquipos}
    >
      Crear equipos
    </button>

    <section className='listadeequipos'>
      { equipos.map((equipo) => (

        <div className="card" key={equipo.equipo}>
          
          <div className="title-card">
            <p>Equipo {equipo.equipo}</p>
          </div>
          <div className='info-nombre'>
            { equipo.jugadores.map((jugador, index) => (
              <label key={jugador?.id || index}>
                <span>
                  <p>
                    {jugador?.apellido?.[0]?.toUpperCase() + jugador?.apellido?.slice(1)}{" "}
                    {jugador?.nombre?.[0]?.toUpperCase() + jugador?.nombre?.slice(1)}
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