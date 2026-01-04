import { Injectable, inject } from '@angular/core';
import { 
  Firestore, collection, doc, setDoc, updateDoc, deleteDoc, 
  collectionData, docData, serverTimestamp, CollectionReference
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private firestore: Firestore = inject(Firestore);
  private collectionName = 'usuarios';
  
  private usuariosCollection = collection(this.firestore, this.collectionName) as CollectionReference<Usuario>;

  // Crea o actualiza el documento de usuario en Firestore
  setUsuario(uid: string, data: Partial<Usuario>): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${uid}`);
    const payload: Partial<Usuario> = {
      ...data,
      updatedAt: serverTimestamp() 
    };
    return setDoc(docRef, payload, { merge: true });
  }

  // Devuelve Observable del documento de usuario.
  // ✅ FIX TS2322: Usamos aserción de tipo en la salida final de docData.
  getUsuario(uid: string): Observable<Usuario | undefined> {
    const docRef = doc(this.firestore, `${this.collectionName}/${uid}`);
    return docData(docRef, { idField: 'id' }) as Observable<Usuario | undefined>; 
  }

  // Actualiza un documento existente
  updateUsuario(uid: string, changes: Partial<Usuario>): Promise<void> {
    const docRef = doc(this.firestore, `${this.collectionName}/${uid}`);
    const payload: Partial<Usuario> = {
      ...changes,
      updatedAt: serverTimestamp()
    };
    return updateDoc(docRef, payload);
  }

  deleteUsuario(uid: string): Promise<void> {
    return deleteDoc(doc(this.firestore, `${this.collectionName}/${uid}`));
  }

  // Lista usuarios (retorna un array de objetos Usuario con su id)
  // ✅ FIX TS2322: Usamos aserción de tipo en la salida final de collectionData.
  listUsuarios(): Observable<Usuario[]> {
    return collectionData(this.usuariosCollection, { idField: 'id' }) as Observable<Usuario[]>;
  }
}