import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { messageInterface } from '../interface/message.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseChatService {
  firestore = inject(Firestore);

  saveAll(message: messageInterface) {
    const col = collection(this.firestore, 'chat');
    return addDoc(col, message);
  }

  getAll(): Observable<messageInterface[]> {
    const col = collection(this.firestore, 'chat');
    return collectionData(col, { idField: 'id' }) as Observable<
      messageInterface[]
    >;
  }
}
