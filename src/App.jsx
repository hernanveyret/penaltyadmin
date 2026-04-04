import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/config.js'
import { getData } from './firebase/auth.js';
import CrearCuenta from './componentes/CrearCuenta';
import Login from './componentes/Login';
import Inicio from './componentes/Inicio.jsx';
import './App.css'

function App() {
  const [ isCrearCuenta, setIsCrearCuenta ] = useState(false);
  const [ isLogin, setIsLogin ] = useState(true);
  const [ isInicio, setIsInicio ] = useState(false)
  const [ usuarioActual, setUsuarioActual ] = useState(null);
  const [ usuarioLogueado, setUsuarioLogueado ] = useState(null)
  const [ db, setDb ] = useState([])

useEffect(() => {
  let unsubscribeData = null;

  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (user) {
      setUsuarioActual(user);
      setUsuarioLogueado(user);
      setIsLogin(false);
      setIsInicio(true);

      // Listener Firestore solo si hay usuario
      unsubscribeData = getData((data) => setDb(data));
    } else {
      // Usuario deslogueado → limpiar listener y datos
      if (unsubscribeData) {
        unsubscribeData();
        unsubscribeData = null;
      }
      setDb([]);
      setUsuarioActual(null);
      setUsuarioLogueado(null);
      setIsInicio(false);
      setIsLogin(true);
    }
  });

  return () => {
    unsubscribeAuth();
    if (unsubscribeData) unsubscribeData();
  };
}, []);
  
  return (
    <div className="app-contenedor">
     
      { isCrearCuenta && 
        <CrearCuenta 
          setIsCrearCuenta={setIsCrearCuenta}
          setIsLogin={setIsLogin} 
        />  
      }
      { isLogin && 
        <Login 
          setIsCrearCuenta={setIsCrearCuenta}
          setIsLogin={setIsLogin} 
        />
      }
      {
        isInicio &&
          <Inicio 
            db={db}
            setDb={setDb}
          />
      }
    </div>
  )
}

export default App