import { useState, useEffect } from 'react';
import { borrarJugador, editarJugador } from '../firebase/auth.js';
import Loader from './Loader';
import './listaJugadores.css'

const ListaJugadores = ({ db, setDb }) => {
const [ jugadores, setJugadores ] = useState([])
const [ isLoader, setIsLoader ] = useState(false)
const [ isEdit, setIsEdit ] = useState(false)
const [ ConfirmBorrar, setIsConfirmBorrar ] = useState(false)
const [ id, setId ] = useState('')


useEffect(() => {
  setIsLoader(true)
if(db && db.length > 0 ){
  const filtro = db[0].jugadores
  setJugadores(filtro)
  setIsLoader(false)
}
},[db])

const ConfirmarBorrarJugador = ({setIsConfirmBorrar, id, setId }) => {
  setTimeout(() => {
    const animacionCard = document.getElementById('card-in-out')
  },1500)
  return (
    <div className='contenedor-confir-borrar'>
      <div className='card-confirm' id='card-in-out'>
        <h3>¿ Desea borrar al jugador {id.nombre} ?</h3>
        <div className='btn-confirm'>
        <button
          onClick={() => { 
            borrarJugadores(id.id);
            setIsConfirmBorrar(false)
          }}
        >SI</button>
        <button
          onClick={() => { 
            const animacionCard = document.getElementById('card-in-out')
            animacionCard.classList.add('animacion-salida')
            setTimeout(() => {
              setId('')
              setIsConfirmBorrar(false);
            },50)          
          }}
        >NO</button>
        </div>
      </div>
    </div>
  )
}

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

const EditarDatosDeJugador = ( {  jugadores, editarJugador, isLoader, setIsLoader, isEdit }) => {
  const [ nombre, setNombre ] = useState('')
  const [ apellido, setApellido ] = useState('');
  const [ posicion, setPosicion ] = useState('');
  const [ error, setError ] = useState(false);
  const [ filtro, setFiltro ] = useState('')
  useEffect(() => {
    nombre && console.log(nombre)
    apellido && console.log(apellido)
    posicion && console.log(posicion)
  },[nombre,apellido,posicion])

  useEffect(() => {
    if(jugadores ){
      console.log(jugadores)
      console.log(id)
      const filtrar = jugadores.find(j => j.id === Number(id))
      console.log(filtrar)
      setNombre(filtrar.nombre)
      setApellido(filtrar.apellido)
      setPosicion(filtrar.posicion ? filtrar.posicion : '' )
      setFiltro(filtrar)
    }
  },[jugadores])

  const cargar = (e) => {
    e.preventDefault()
    console.log('cargar datos actualizados')
    setIsEdit(false)
    setId('')

    const datosEdit = {
      id,
      nombre,
      apellido,
      posicion,
      estado: filtro.estado,
    }
    console.log(datosEdit)
  }

  return (
    <div className="contenedor-form-editar">
      <div className="formularioLogin">
        <button
          onClick={() => {
            setId('')
            setIsEdit(false)
          }
          }
        >X</button>
        { isLoader && <Loader /> }
          <h3>Editar datos de jugadores</h3>
          <form
            onSubmit={cargar}
          >
            <input  value={nombre} name='nombre' placeholder='Nombre' onChange={(e) => setNombre(e.target.value)}/>
            <input  value={apellido} name='apellido' placeholder='Apellido' onChange={(e) => setApellido(e.target.value)}/>
            <input  value={posicion} name='posicion' placeholder='Posicion' onChange={(e) => setPosicion(e.target.value)}/>
            { error && <p className="error-numero">*Ingrese un numero valido</p>}
            <button type='submit'>CARGAR</button>
          </form>
      </div>
    </div>
  )
}

  return (
    <div className="contenedor-lista-jugadores">
      { isLoader && <Loader /> }
      {
        ConfirmBorrar &&
          <ConfirmarBorrarJugador 
            id={id}
            setId={setId}
            setIsConfirmBorrar={setIsConfirmBorrar}
          />
      }
      {
        isEdit && 
          <EditarDatosDeJugador
          jugadores={jugadores}
          editarJugador={editarJugador}
          isLoader={isLoader}
          setIsLoader={setIsLoader}
          id={id}
          setId={setId}
          />
      }
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
                  <p style={{color: 'orange'}}>P-{j.posicion}</p>
                </div>                
                <div className="nav-btn-lista">
                  <button
                    title='Editar'
                    type='button'
                    className='btn-lista-jugadores'
                    onClick={() => {
                      setId(j.id)
                      setIsEdit(true)
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                  </button>
                  <button
                    title='Borrar jugadore'
                    type='button'
                    className='btn-lista-jugadores'
                    onClick={() => {
                      //setId(j.id)
                      setId({
                        id: j.id,
                        nombre : `${j.nombre} ${j.apellido}`
                      })
                      setIsConfirmBorrar(true)
                      //borrarJugadores(j.id)
                    }}
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