import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Auth, authState } from '@angular/fire/auth';
import { MascotasService } from '../services/mascotas.service';
import { Mascota } from '../models/mascota';
import { filter, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-mis-mascotas',
  templateUrl: './mis-mascotas.page.html',
  styleUrls: ['./mis-mascotas.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class MisMascotasPage {
  mascotas$: Observable<Mascota[]> = authState(this.auth).pipe(
    filter((user): user is NonNullable<typeof user> => !!user),
    switchMap(user => this.mascotasService.getAllForUser(user.uid))
  );
  constructor(private mascotasService: MascotasService, private auth: Auth) {}

  borrar(id?: string) {
    if (!id) return;
    this.mascotasService.delete(id).catch(err => console.error(err));
  }
}