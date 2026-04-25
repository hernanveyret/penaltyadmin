import { useState, useEffect } from 'react';
import './menu.css'

const Menu = ({
  jugadores,
  crearEquipos,
  crearEnganchados,
  crearRepechaje,
  setOpenMenu,
  setIsMezclar,
  setIsListaDeJugadores,
  setIsPartidosTerminados,
  setIsJugar,
}) => {
  return (
    <div className="contenedor-menu">      
        <button
          type='button'
          onClick={crearRepechaje}
        >Repechajes
        </button>
        <button
          type='button'
          onClick={() => {
            crearEquipos();
            setOpenMenu(false);
          }} 
        >Crear partidos
        </button>
        <button
          type='button'
          onClick={() => { 
          crearEnganchados()
        }}
        >Enganchados
        </button>
        <button
          type='button'
          onClick={() => {
            setIsListaDeJugadores(false);
            setOpenMenu(false);
            setIsMezclar(true)
          }}
        >Mezclar jugadores
        </button>   
    </div>
  )
}

export default Menu