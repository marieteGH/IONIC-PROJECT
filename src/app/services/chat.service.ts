import { Injectable, inject } from '@angular/core';
import { 
  Firestore, collection, addDoc, query, where, 
  getDocs, doc, orderBy, serverTimestamp, updateDoc, onSnapshot 
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore = inject(Firestore);

  // Gatillo para recargar
  private refreshTrigger = new Subject<void>();
  refresh$ = this.refreshTrigger.asObservable();

  triggerRefresh() {
    this.refreshTrigger.next();
  }

  getOrCreateChat(myUid: string, myName: string, receptorUid: string, receptorName: string): Observable<string> {
    const chatsRef = collection(this.firestore, 'chats');
    const q = query(chatsRef, where('participantes', 'array-contains', myUid));

    return from(getDocs(q)).pipe(
      switchMap(snap => {
        const existingChat = snap.docs.find(doc => {
          const p = doc.data()['participantes'] as string[];
          return p.includes(receptorUid);
        });

        if (existingChat) {
          return of(existingChat.id);
        } else {
          return from(addDoc(chatsRef, {
            participantes: [myUid, receptorUid],
            nombres: {
              [myUid]: myName,
              [receptorUid]: receptorName
            },
            updatedAt: serverTimestamp(),
            lastMessage: 'Nueva conversación'
          })).pipe(map(docRef => docRef.id));
        }
      })
    );
  }

  // --- CORRECCIÓN IMPORTANTE AQUÍ ---
  // Usamos onSnapshot dentro de un Observable manual.
  // Esto elimina el error "outside injection context" y funciona siempre.
  getMyChats(myUid: string): Observable<any[]> {
    const chatsRef = collection(this.firestore, 'chats');
    
    // NOTA: Esta consulta requiere el índice que debes crear con el link de la consola
    const q = query(
      chatsRef, 
      where('participantes', 'array-contains', myUid), 
      orderBy('updatedAt', 'desc')
    );

    return new Observable((observer) => {
      // onSnapshot escucha cambios en tiempo real de forma robusta
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const chats = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          observer.next(chats);
        },
        (error) => {
          observer.error(error);
        }
      );

      // Cuando el componente se destruye, dejamos de escuchar
      return () => unsubscribe();
    });
  }

  getMessages(chatId: string): Observable<any[]> {
    // También aplicamos la corrección aquí por seguridad
    const messagesRef = collection(this.firestore, `chats/${chatId}/mensajes`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    
    return new Observable((observer) => {
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          observer.next(messages);
        },
        (error) => observer.error(error)
      );
      return () => unsubscribe();
    });
  }

  async sendMessage(chatId: string, senderId: string, texto: string) {
    const messagesRef = collection(this.firestore, `chats/${chatId}/mensajes`);
    const chatDoc = doc(this.firestore, `chats/${chatId}`);
    
    await addDoc(messagesRef, { 
      senderId, 
      texto, 
      createdAt: serverTimestamp() 
    });
    
    await updateDoc(chatDoc, { 
      lastMessage: texto, 
      updatedAt: serverTimestamp() 
    });
  }
}