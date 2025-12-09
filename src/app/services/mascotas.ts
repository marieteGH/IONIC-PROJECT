import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mascota } from '../models/mascota';

@Injectable({
  providedIn: 'root'
})
export class MascotasService {

  private path = 'mascotas';

  constructor(private firestore: Firestore) {}

  // Referencia a la colección
  private col() {
    return collection(this.firestore, this.path);
  }

  // Obtener todas las mascotas (Observable)
  getAll(): Observable<Mascota[]> {
    // collectionData devuelve un Observable con los documentos; { idField: 'id' } añade el id al objeto
    return collectionData(this.col(), { idField: 'id' }) as Observable<Mascota[]>;
  }

  // Obtener una mascota por id
  getById(id: string): Observable<Mascota | undefined> {
    const d = doc(this.firestore, `${this.path}/${id}`);
    return docData(d, { idField: 'id' }) as Observable<Mascota | undefined>;
  }

  // Crear nueva mascota
  create(mascota: Omit<Mascota, 'id'>) {
    return addDoc(this.col(), mascota);
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