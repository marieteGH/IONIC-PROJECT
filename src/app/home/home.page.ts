import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

// Servicios y Modelos
import { PublicacionesService } from '../services/publicaciones.service';
import { UsuarioService } from '../services/usuario.service'; // <--- Importamos esto
import { Publicacion } from '../models/publicacion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class HomePage implements OnInit {
  private publicacionesService = inject(PublicacionesService);
  private usuarioService = inject(UsuarioService); // <--- Inyectamos el servicio

  publicaciones$: Observable<Publicacion[]>;
  
  // Diccionario para guardar "ID -> Nombre"
  usuariosMap: Record<string, string> = {};

  constructor() {
    this.publicaciones$ = this.publicacionesService.getPublicaciones();
  }

  ngOnInit() {
    // Cargamos todos los usuarios para saber sus nombres
    this.usuarioService.listUsuarios().subscribe((usuarios) => {
      usuarios.forEach((u) => {
        if (u.id) {
          // Guardamos: el ID es la clave, el Nombre es el valor
          this.usuariosMap[u.id] = u.displayName || u.email || 'Usuario Anónimo';
        }
      });
    });
  }
}