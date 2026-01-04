import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mascota } from '../models/mascota';


@Injectable({
  providedIn: 'root'
})
export class MascotasService {

  private path = 'mascotas'; // colección principal
  private firestore = inject(Firestore);


  constructor() {}

  private col() {
    return collection(this.firestore, this.path);
  }

  // Crear mascota asociada a un usuario (ownerId)
  createForUser(uid: string, mascota: Omit<Mascota, 'id' | 'ownerId'>) {
    const data = { ...mascota, ownerId: uid };
    return addDoc(this.col(), data);
  }

  // Obtener todas las mascotas de un usuario (Observable)
  getAllForUser(uid: string): Observable<Mascota[]> {
    
    const colRef = collection(this.firestore, 'mascotas');
    const q = query(colRef, where('ownerId', '==', uid));

    return collectionData(q, { idField: 'id' }) as Observable<Mascota[]>;
  }

  // Obtener mascota por id
  getById(id: string) {
    const d = doc(this.firestore, `${this.path}/${id}`);
    return docData(d, { idField: 'id' }) as Observable<Mascota | undefined>;
  }

  // Actualizar
  update(id: string, changes: Partial<Mascota>) {
    const d = doc(this.firestore, `${this.path}/${id}`);
    return updateDoc(d, changes as any);
  }

  // Borrar
  delete(id: string) {
    const d = doc(this.firestore, `${this.path}/${id}`);
    return deleteDoc(d);
  }
}