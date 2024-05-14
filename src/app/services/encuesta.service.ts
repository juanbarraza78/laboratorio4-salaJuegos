import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { encuestaInterface } from '../interface/encuesta.interface';

@Injectable({
  providedIn: 'root',
})
export class EncuestaService {
  path: string = 'encuestas';
  firestore = inject(Firestore);

  saveAll(encuesta: encuestaInterface) {
    const col = collection(this.firestore, this.path);
    return addDoc(col, encuesta);
  }

  getAll(): Observable<encuestaInterface[]> {
    const col = collection(this.firestore, this.path);
    return collectionData(col, { idField: 'id' }) as Observable<
      encuestaInterface[]
    >;
  }
}
