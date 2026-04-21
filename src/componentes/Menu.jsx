import { useState, useEffect } from 'react';
import './menu.css'

const Menu = ({
  jugadores,
  crearEquipos,
  crearEnganchados,
  crearRepechaje,
  setOpenMenu,
}) => {
  return (
    <div className="contenedor-menu">      
        <button
          type='button'
        >Mezclar jugadores</button>
        <button
          type='button'
          onClick={() => {
            crearEquipos();
            setOpenMenu(false);
          }} 
        >Crear partidos</button>
        <button
          type='button'
          onClick={crearRepechaje}
        >Repechajes</button>
        <button
          type='button'
          onClick={() => { 
          crearEnganchados()
        }}
        >Enganchados</button>      
    </div>
  )
}

export default Menu