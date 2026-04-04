import { GoogleAuthProvider,
         onAuthStateChanged,
         signInWithPopup,
         signOut,
         signInWithEmailAndPassword,
         createUserWithEmailAndPassword } from "firebase/auth";

import { collection,
         getDocs,
         onSnapshot, 
         doc, 
         updateDoc, 
         arrayUnion, 
         arrayRemove } from "firebase/firestore";

import { auth, db, analytics } from "./config";

const provider = new GoogleAuthProvider();

// Función para login con email y contraseña
export const loginWithEmail = async (email, password) => {
  console.log(email, password)
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // devuelve el usuario logueado
  } catch (error) {
    console.error("Error al iniciar sesión:", error.code, error.message);
    throw error; // para manejarlo en Login.jsx
  }
};

// Login con google
export const loginWhihtGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('Logeado usuario: ', user);
    return user;
  } catch (error) {
    console.log('Error al iniciar sesion: ', error);
  }
}

// Cerrar sesion
export const cerrarSesion = async () => {
  signOut(auth).then(() => {
    console.log('Sesion finalizada')
  })
}

// Crear cuenta de correo
export const crearCuentaEmail = async (datosUser) => {
  try {
    const result = await createUserWithEmailAndPassword(auth,datosUser.correo,datosUser.contraseña);
    const user = result.user;
    return user;
  } catch (error) {
    console.log('No se pudo cargar el nuevo usuario: ', error);
  }
}

// Escuchar cambios en tiempo real y descargarlos
export const getData = (callback) => {
  try {
    const unsubscribe = onSnapshot(collection(db,'torneos'), snapshot => {
      const torneos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))
    callback(torneos);
  })
  return unsubscribe;
  } catch (error) {
    callback([]);
  }
}

export const agregarJugador = async (  nuevoJugador ) => {
  console.log(nuevoJugador)
  if(!'SS194bqzsNqVQqyWZVPm'){
    throw new error('S necesita el UID para agregar el producto');
  }

  // Crear una referencia del documento del usuario logueado.
  const userDocRef = doc(db, 'torneos', 'SS194bqzsNqVQqyWZVPm');
 try {
  await updateDoc(userDocRef, {
    jugadores: arrayUnion(nuevoJugador)
  });
  console.log('Producto agregado con exito')
 } catch (error) {
  console.error('Error al cargar el producto: ', error);
  throw error
 }
}

export const borrarJugador = async (update) => {
  const userDocRef = doc(db, 'torneos', 'SS194bqzsNqVQqyWZVPm');
  try {
    await updateDoc(userDocRef, {
      jugadores: update
    });
    console.log('Jugador borrado con exito')
  } catch (error) {
    console.error('Error al borrar el jugador: ', error);
    throw error
  }

}

export const crearPartidas = async (nuevoPartida) => {
  const userDocRef = doc(db, 'torneos', 'SS194bqzsNqVQqyWZVPm');
  try {
    await updateDoc(userDocRef, {
      equipos: arrayUnion(...nuevoPartida)
    });
    console.log('equipos agregado con exito')
  } catch (error) {
    console.error('Error al cargar los equipos: ', error);
    throw error
  }
}

export const borrarPartidas = async () => {
  const userDocRef = doc(db, 'torneos', 'SS194bqzsNqVQqyWZVPm');
  try {
    await updateDoc(userDocRef, {
      equipos: []
    });

    console.log('equipos borrados')

  } catch (error) {
    console.error('Error al borrar los equipos: ', error);
    throw error
  }
}

export const checkGanador = async (update) => {
  console.log(update)
  const userDocRef = doc(db, 'torneos', 'SS194bqzsNqVQqyWZVPm');
  try {
    await updateDoc(userDocRef, {
      equipos: update
    });
    console.log('ganador marcado')
  } catch (error) {
    console.error('Error al marcar el ganador: ', error);
    throw error
  }
}