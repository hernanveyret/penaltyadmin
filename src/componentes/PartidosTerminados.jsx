import { useState, useEffect } from 'react';
import './partidosTerminados.css';
import pelota from '/img/pelota.png';
const PartidosTerminados = ({ db, setDb }) => {
const [ juegosFinalizados, setJuegosFinalizados ] = useState(db[0]?.partidosFinalizados ? db[0]?.partidosFinalizados : [])
const [ bloques, setBloques ] = useState([])

useEffect(() => {
  if(db){
    setJuegosFinalizados(db[0]?.partidosFinalizados || [])
  }
},[db])
let arbol = []
useEffect(() => {
  juegosFinalizados && console.log(juegosFinalizados)
  const gruposDePartidos = juegosFinalizados.map(j => j.jugadas);
// Para saber cuántos hay en el primero:
console.log(gruposDePartidos);

},[juegosFinalizados])

  return (
  <div className="contendor-partidos-terminados">
    <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Partidos terminados</h3>

    {juegosFinalizados && juegosFinalizados.map((j, index) => (
      <div key={index} className="bloque-partidos">
        {/* Si no es el primer bloque, mostramos un separador visual */}
        {index > 0 && <div className="separador-bloque"></div>}
        
        <p className="titulo-bloque">Sesión de juego #{juegosFinalizados.length - index}</p>
        
        <div className="contenedor-lista">
          {j.jugadas.map((p, i) => (
            <div className='cardSave' key={i}>
              <p>Partido #{p.partido}</p>
              <div className='nombre'>
                <span>
                  <p>{p.jugadores[0].nombre}</p>
                  {p.jugadores[0].estado ? <img src={pelota} alt='Pelota' /> : ''}
                </span>
                <span>
                  <p>{p.jugadores[1].nombre}</p>
                  {p.jugadores[1].estado ? <img src={pelota} alt='Pelota' /> : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
};
export default PartidosTerminados;