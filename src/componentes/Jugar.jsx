import { useState, useEffect, useRef } from 'react'
import { borrarPartidas, checkGanador, borrarJugador, agregarPartidosFinalizados, borrarRepechajes } from '../firebase/auth.js'
import Loader from './Loader.jsx'
import './jugar.css'

const Jugar = ({ 
        db, 
        setDb, 
        juegosFinalizados, 
        setJuegosFinalizados, 
        equipos, 
        setEquipos,
        jugadores,
        setJugadores
     }) => {
const [ isLoader, setIsLoader ] = useState(false);
const [ cantidadDePartidos, setCantidadDePartidos ] = useState({});
const [ tituloEnganchados, setTituloEnganchados ] = useState('')
const [ ConfirmAnular, setIsConfirmAnular ] = useState(false)

useEffect(() => {
  if(db){
    const estadoInicial = {}
    equipos.forEach((_, i) => {
    estadoInicial[`partido-${i+1}`] = true
  })
  setCantidadDePartidos(estadoInicial)  
  }
},[])



function mezclar(array) {
  const copia = [...array]

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }

  return copia
}



const ConfirmarAnularPartidos = ({setIsConfirmAnular }) => {
  setTimeout(() => {
    const animacionCard = document.getElementById('card-in-out')
  },1500)
  return (
    <div className='contenedor-confir-borrar'>
      <div className='card-confirm' id='card-in-out'>
        <h3>¿ Desea anular los partidos ?</h3>
        <div className='btn-confirm'>
        <button
          onClick={() => { 
            anularPartidos()
            setIsConfirmAnular(false)
          }}
        >SI</button>
        <button
          onClick={() => { 
            const animacionCard = document.getElementById('card-in-out')
            animacionCard.classList.add('animacion-salida')
            setTimeout(() => {              
              setIsConfirmAnular(false);
            },50)          
          }}
        >NO</button>
        </div>
      </div>
    </div>
  )
}

const anularPartidos = async () => {
  
  try {
    
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

const finalizarRepechajes = () => {
  let perdedoresId = []
  equipos.forEach(jugador => {
    jugador.jugadores.forEach(p => {
      if(!p.estado){
        console.log(p.nombre)
        perdedoresId.push(p.id)
      }
    })
  })

  console.log(perdedoresId)
    const ganadores = jugadores.filter(j => !perdedoresId.includes(j.id));
    console.log(ganadores)
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
  console.log('perdedores', perdedores)
  const resetJugadores = jugadores.filter(j => !perdedores.includes(j.id))
  console.log('reset jugadores ', resetJugadores)
  try {
    setEquipos([])
     await agregarPartidosFinalizados(equipos)
     await borrarPartidas()
     await borrarJugador(resetJugadores);
     await borrarRepechajes();
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

useEffect(() => {
  jugadores && console.log(jugadores)
},[jugadores])



return (
  <div className="contenedor-jugar">
    { isLoader && <Loader /> }
    {  ConfirmAnular && <ConfirmarAnularPartidos setIsConfirmAnular={setIsConfirmAnular}/>  }
    <h2>JUGAR</h2>
    { 
      equipos.length > 32 
      ?
      <h3 style={{ color:'green', backgroundColor:'white', padding: '5px 30px', borderRadius: '5px', marginBottom: '10px'}}>ELIMINATORIAS</h3> 
      :
      equipos.length === 32
      ?
      <h3 style={{ color:'green', backgroundColor:'white', padding: '5px 30px', borderRadius: '5px', marginBottom: '10px'}}>32 AVOS</h3>
      :
      equipos.length === 16
      ?
      <h3 style={{ color:'green', backgroundColor:'white', padding: '5px 30px', borderRadius: '5px', marginBottom: '10px'}}>16 AVOS</h3>
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
            //anularPartidos()
            setIsConfirmAnular(true)
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
      <button 
        title='Finalizar partida'
        type='button'
        className='btn-crear-equipos'
        onClick={finalizarRepechajes}
        >
        Finalizar repechaje
      </button>
      <button
        type='button'
        className='btn-reset-jugada'
        onClick={() => borrarRepechajes()}
      >
          Anular repechajes
      </button>   
    </div>
  </div>
)
}
export default Jugar;
//name={`jugador-${equipo.equipo}-${index}`}