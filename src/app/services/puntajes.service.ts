import { Injectable } from '@angular/core';
import {
  Firestore,
  getDocs,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from '@angular/fire/firestore';
import { authState, updateProfile, getAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Puntaje } from '../models/puntaje';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class PuntajesService {
  user$?: Observable<any | null>;
  puntajes: Puntaje[] = [];
  puntaje: number = 0;

  constructor(private firestore: Firestore) {
    getAuth().onAuthStateChanged(() => {
      this.user$ = new Observable((observer) => {
        observer.next(getAuth().currentUser);
      });
    });
  }

  private async obtenerUsuario(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.user$?.subscribe(async (data) => {
        resolve(data);
      });
    });
  }

  private async guardarPuntajeBase(puntaje: number, juego: string) {
    let usuario = await this.obtenerUsuario();
    let data = {
      usuario: usuario.displayName ? usuario.displayName : usuario.email,
      fecha: new Date().getTime(),
      puntaje: puntaje,
      juego: juego,
    };
    const usuarioRef = collection(this.firestore, 'puntajes');
    return addDoc(usuarioRef, data);
  }

  async obtenerPuntajes(juego: string) {
    this.puntajes = [];
    const querySnapshot = await getDocs(collection(this.firestore, 'puntajes'));
    querySnapshot.forEach((doc) => {
      let puntaje = doc.data() as Puntaje;
      puntaje.id = doc.id;
      this.puntajes.push(puntaje);
    });
    this.puntajes = this.puntajes.filter((element) => element.juego === juego);
    return this.puntajes;
  }

  async guardarPuntaje(puntaje: number, juego: string) {
    this.puntaje = puntaje;
    if (puntaje !== 0) {
      await Swal.fire({
        title: '¿Esta seguro que quiere guardar el puntaje?',
        text:
          'Se reiniciara el contador de puntos,actualmente tiene: ' + puntaje,
        showDenyButton: true,
        confirmButtonText: 'Guardar',
        denyButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.guardarPuntajeBase(puntaje, juego)
            .then(async (respuesta) => {
              await Swal.fire('Puntaje guardado', '', 'success');
              this.puntaje = 0;
            })
            .catch((error) => {
              Swal.fire('Error al guardar puntaje', '', 'error');
              console.log(error);
            });
        } else if (result.isDenied) {
          //Swal.fire('Changes are not saved', '', 'info')
        }
      });
    } else {
      Swal.fire('ERROR', 'No se puede guardar puntajes nulos', 'error');
    }

    return this.puntaje;
  }
}
