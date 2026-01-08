import { Component, inject, OnInit } from '@angular/core';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
// AÑADIDO: Importamos logOutOutline
import { chatbubbleEllipsesOutline, pawOutline, locationOutline, calendarOutline, add, logOutOutline } from 'ionicons/icons';

import { PublicacionesService } from '../services/publicaciones.service';
import { UsuarioService } from '../services/usuario.service';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { Publicacion } from '../models/publicacion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class HomePage implements OnInit, ViewWillEnter {
  private publicacionesService = inject(PublicacionesService);
  private usuarioService = inject(UsuarioService);
  private chatService = inject(ChatService);
  private auth = inject(AuthService);
  private router = inject(Router);

  publicaciones$: Observable<Publicacion[]>;
  usuariosMap: Record<string, string> = {};
  myUid: string | null = null;

  constructor() {
    // AÑADIDO: Registramos el icono de log-out-outline
    addIcons({ chatbubbleEllipsesOutline, pawOutline, locationOutline, calendarOutline, add, logOutOutline });
    this.publicaciones$ = this.publicacionesService.getPublicaciones();
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  ionViewWillEnter() {
    this.myUid = this.auth.getUserId();
  }

  cargarUsuarios() {
    this.usuarioService.listUsuarios().subscribe((usuarios) => {
      usuarios.forEach((u) => {
        if (u.id) {
          this.usuariosMap[u.id] = u.displayName || u.email || 'Usuario Anónimo';
        }
      });
    });
  }

  // NUEVA FUNCIÓN: Cerrar sesión
  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  contactarDueno(p: Publicacion) {
    if (!this.myUid) return;

    const receptorId = p.usuarioId;
    if (!receptorId) return;

    const receptorNombre = this.usuariosMap[receptorId] || 'Usuario';
    const myNombre = this.usuariosMap[this.myUid] || 'Yo';

    this.chatService.getOrCreateChat(this.myUid, myNombre, receptorId, receptorNombre)
      .subscribe(chatId => {
        const mensajeInteres = `Hola, estoy interesado en tu publicación: "${p.titulo}" sobre ${p.mascotaNombre}.`;
        
        this.chatService.sendMessage(chatId, this.myUid!, mensajeInteres).then(() => {
          this.router.navigate(['/tabs/chat'], { 
            queryParams: { chatId: chatId, nombre: receptorNombre } 
          });
        });
      });
  }
}