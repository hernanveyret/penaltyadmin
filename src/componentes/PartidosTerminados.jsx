import { useState, useEffect } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import './partidosTerminados.css';
import pelota from '/img/pelota.png';
const PartidosTerminados = ({ db, setDb }) => {
const [ juegosFinalizados, setJuegosFinalizados ] = useState(db[0]?.partidosFinalizados ? db[0]?.partidosFinalizados : [])
const [ bloques, setBloques ] = useState([])
const [ conteoFaces, setConteoFaces ] = useState([])

useEffect(() => {
  if(db){
    setJuegosFinalizados(db[0]?.partidosFinalizados || [])
  }
},[db])

let arbol = []

useEffect(() => {
  const gruposDePartidos = juegosFinalizados.map(j => j.jugadas);
// Para saber cuántos hay en el primero:
//console.log(gruposDePartidos);
setConteoFaces(gruposDePartidos)
},[juegosFinalizados])

  return (
    

  <div className="bracket-container">
    

    {juegosFinalizados && juegosFinalizados.map((j, index) => (
      <div key={index} className="columna-fase">
        <h3 className="titulo-fase">
          { 
            conteoFaces?.[index]?.length === 1 ? 
            'Final' : 
            conteoFaces?.[index]?.length === 2 ?
            'Semi final' :
            conteoFaces?.[index]?.length === 4 ?
            'Cuartos de final' :
            conteoFaces?.[index]?.length === 8 ?
            'Octavos de final' :
            `Eliminatorias ${index+1}` 
          }
        </h3>
        
        <div className="contenedor-lista-bracket">
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

  )   
 
};
export default PartidosTerminados;