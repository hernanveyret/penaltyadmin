import { useState, useEffect } from 'react';
import { borrarJugador } from '../firebase/auth.js';
import Loader from './Loader';
import './listaJugadores.css'

const ListaJugadores = ({ db, setDb }) => {
const [ jugadores, setJugadores ] = useState([])
const [ isLoader, setIsLoader ] = useState(false)

useEffect(() => {
  setIsLoader(true)
if(db && db.length > 0 ){
  const filtro = db[0].jugadores
  setJugadores(filtro)
  setIsLoader(false)
}
},[db])

const borrarJugadores = async (id) => {
  console.log('Borrar jugador: ', id)
  const filtro = db[0].jugadores?.filter(j => j.id !== id )
  console.log(filtro)
  try {
    setJugadores(filtro)
    await borrarJugador(filtro)
    console.log('se borro el jugador: ', id)
  } catch (error) {
    console.log('Error al borrar el jugador: ', id)
  }
}

const editarJugador = (id) => {
  console.log('Editar jugador: ', id)
}

  return (
    <div className="contenedor-lista-jugadores">
      { isLoader && <Loader /> }
      <h2>Lista de jugadores</h2>
      <div className="lista">
        { 
          jugadores.length > 0 ?
            jugadores.map((j, i) => ( 
              <div className='card-lista' key={i}>
                <div className="infoJugadores">
                  <p>#{i+1}</p>
                   <p>{j.nombre ? j.nombre[0].toUpperCase() + j.nombre.slice(1) : ''}</p>
                  <p>{ j.apellido ? j.apellido[0].toUpperCase() + j.apellido.slice(1) : '' }</p>
                </div>                
                <div className="nav-btn-lista">
                  <button
                    title='Editar'
                    type='button'
                    className='btn-lista-jugadores'
                    onClick={() => editarJugador(j.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                  </button>
                  <button
                    title='Borrar jugadore'
                    type='button'
                    className='btn-lista-jugadores'
                    onClick={() => borrarJugadores(j.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#EA3323"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                  </button>  
                </div>
              </div>
            ))
            :
            <p style={{textAlign:'center', fontSize:'14px',marginTop:'20px'}}>No hay jugadores registrados</p>
        }
      </div>
    </div>
  )
}
export default ListaJugadores;