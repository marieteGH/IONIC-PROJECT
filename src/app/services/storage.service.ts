import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage = inject(Storage);

  uploadProfileImage(file: File, path: string): Observable<string> {
    return new Observable<string>((observer) => {
      const storageRef = ref(this.storage, path);
      const task = uploadBytesResumable(storageRef, file);

      task.on(
        'state_changed',
        // progreso (si algún día quieres, aquí puedes emitir %)
        undefined,
        // error
        (err) => observer.error(err),
        // complete
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            observer.next(url);
            observer.complete();
          } catch (e) {
            observer.error(e);
          }
        }
      );
    });
  }
}
