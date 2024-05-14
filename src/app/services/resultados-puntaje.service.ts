import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import {
  resultadosInterface,
  resultadosInterfaceID,
} from '../interface/resultados.interface';

@Injectable({
  providedIn: 'root',
})
export class ResultadosPuntajeService {
  path: string = 'puntajes';
  firestore = inject(Firestore);

  saveAll(puntage: resultadosInterface) {
    const col = collection(this.firestore, this.path);
    return addDoc(col, puntage);
  }

  getAll(): Observable<resultadosInterfaceID[]> {
    const col = collection(this.firestore, this.path);
    return collectionData(col, { idField: 'id' }) as Observable<
      resultadosInterfaceID[]
    >;
  }
}
