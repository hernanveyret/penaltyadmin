import { useState, useEffect } from 'react';
import './partidosTerminados.css';
import pelota from '/img/pelota.png';
const PartidosTerminados = ({ db, setDb }) => {
const [ juegosFinalizados, setJuegosFinalizados ] = useState(db[0]?.partidosFinalizados ? db[0]?.partidosFinalizados : [])

useEffect(() => {
  if(db){
    setJuegosFinalizados(db[0]?.partidosFinalizados || [])
  }
},[db])

useEffect(() => {
  juegosFinalizados && console.log(juegosFinalizados)
  //juegosFinalizados && console.log(juegosFinalizados[0].jugadas)
  if(juegosFinalizados){
    juegosFinalizados.forEach(j => {
      j.jugadas.forEach(p => {
        console.log(p.partido)
        console.log(p.jugadores[0].nombre)
        console.log(p.jugadores[1].nombre)
        
      })
    })
  }
},[juegosFinalizados])

  return (
    <div className="contendor-partidos-terminados">
      <h3 style={{textAlign:'center'}}>Partidos terminados</h3>
      <div className="contenedor-lista">
        {
          juegosFinalizados &&
           juegosFinalizados.map(j => (          
          
            j.jugadas.map((p, i) => (
              <div className='cardSave' key={i}>
                <p>Partido #{p.partido}</p>
                <div className='nombre'>
                  <span><p>{p.jugadores[0].nombre}</p>{ p.jugadores[0].estado ? <img src={pelota} alt='Pelota' /> : '' }</span>
                  <span><p>{p.jugadores[1].nombre}</p>{ p.jugadores[1].estado ? <img src={pelota} alt='Pelota' /> : '' }</span>
                </div>
              </div>
              
            ))
           ))
          
          
        }
      </div>
    </div>
  )
};
export default PartidosTerminados;