import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth, authState } from '@angular/fire/auth';
import { MascotasService } from '../services/mascotas.service';
import { Mascota } from '../models/mascota';

@Component({
  selector: 'app-mis-mascotas',
  templateUrl: './mis-mascotas.page.html',
  styleUrls: ['./mis-mascotas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MisMascotasPage {
  mascotas$: Observable<Mascota[]> = of([]);

  constructor(private mascotasService: MascotasService, private auth: Auth) {
    this.mascotas$ = authState(this.auth).pipe(
      switchMap(user => {
        if (user) return this.mascotasService.getAllForUser(user.uid);
        return of([]);
      })
    );
  }

  borrar(id?: string) {
    if (!id) return;
    this.mascotasService.delete(id).catch(err => console.error(err));
  }
}