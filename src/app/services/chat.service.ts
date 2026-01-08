import { Injectable, inject } from '@angular/core';
import { 
  Firestore, collection, addDoc, query, where, 
  getDocs, collectionData, doc, orderBy, serverTimestamp, updateDoc 
} from '@angular/fire/firestore';
import { Observable, from, map, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private firestore = inject(Firestore);

  // Ahora guarda obligatoriamente los nombres para evitar el texto "Conversación"
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

  getMyChats(myUid: string): Observable<any[]> {
    const chatsRef = collection(this.firestore, 'chats');
    const q = query(chatsRef, where('participantes', 'array-contains', myUid), orderBy('updatedAt', 'desc'));
    return collectionData(q, { idField: 'id' });
  }

  getMessages(chatId: string): Observable<any[]> {
    const messagesRef = collection(this.firestore, `chats/${chatId}/mensajes`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' });
  }

  async sendMessage(chatId: string, senderId: string, texto: string) {
    const messagesRef = collection(this.firestore, `chats/${chatId}/mensajes`);
    const chatDoc = doc(this.firestore, `chats/${chatId}`);
    await addDoc(messagesRef, { senderId, texto, createdAt: serverTimestamp() });
    await updateDoc(chatDoc, { lastMessage: texto, updatedAt: serverTimestamp() });
  }
}