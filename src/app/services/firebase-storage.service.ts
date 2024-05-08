import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { LogInterface } from '../interface/log.interface';

@Injectable({
  providedIn: 'root',
})
export class FirebaseStorageService {
  firestore = inject(Firestore);

  saveAll(log: LogInterface) {
    const col = collection(this.firestore, 'logs');
    addDoc(col, log);
  }
  getAll() {
    const col = collection(this.firestore, 'logs');
    const observable = collectionData(col);
    observable.subscribe((res) => {
      console.log(res);
    });
  }
  // update(id: string) {
  //   const col = collection(this.firestore, 'logs');
  //   const documet = doc(col, id);
  //   updateDoc(documet, {
  //     nombre: 'NuevoNombre',
  //   });
  // }
  // delete(id: string) {
  //   const col = collection(this.firestore, 'logs');
  //   const documet = doc(col, id);
  //   deleteDoc(documet);
  // }
}
