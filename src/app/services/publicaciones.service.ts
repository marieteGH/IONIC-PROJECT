import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Publicacion } from '../models/publicacion';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  private firestore = inject(Firestore);
  private collectionName = 'publicaciones';

  constructor() {}

  // Crear una nueva publicación (Guardar)
  addPublicacion(publicacion: Publicacion) {
    const colRef = collection(this.firestore, this.collectionName);
    return addDoc(colRef, publicacion);
  }

  // Obtener todas las publicaciones (Leer)
  getPublicaciones(): Observable<Publicacion[]> {
    const colRef = collection(this.firestore, this.collectionName);
    // Ordenamos para que salgan las más nuevas primero ('desc')
    const q = query(colRef, orderBy('createdAt', 'desc')); 
    return collectionData(q, { idField: 'id' }) as Observable<Publicacion[]>;
  }
}