import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  uploadProfileImage(file: File, path: string): Observable<string> {
    const fileRef = this.storage.ref(path);
    const task = this.storage.upload(path, file);

    return new Observable<string>(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            observer.next(url);
            observer.complete();
          }, err => observer.error(err));
        })
      ).subscribe();
    });
  }
}