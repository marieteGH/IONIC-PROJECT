import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewWillEnter } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { send, arrowBack, personCircleOutline } from 'ionicons/icons';

// Servicios
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service'; // IMPORTANTE

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatPage implements OnInit, ViewWillEnter {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private auth = inject(AuthService);
  private usuarioService = inject(UsuarioService); // Inyectamos servicio de usuarios

  chatId: string | null = null;
  receptorNombre: string = '';
  nuevoMensaje: string = '';
  
  mensajes$: Observable<any[]> | null = null;
  misChats$: Observable<any[]> | null = null;
  
  myUid: string = ''; 
  usuariosMap: Record<string, string> = {}; // Mapa para nombres reales

  constructor() {
    addIcons({ send, arrowBack, personCircleOutline });
  }

  ngOnInit() {
    // Inicialización básica
    this.checkUserAndLoad();
    
    this.route.queryParams.subscribe(params => {
      this.chatId = params['chatId'] || null;
      // Si nos pasan el nombre por parámetro lo usamos, si no, se calculará
      this.receptorNombre = params['nombre'] || ''; 
      
      if (this.chatId) {
        this.mensajes$ = this.chatService.getMessages(this.chatId);
      }
    });
  }

  // Se ejecuta SIEMPRE que entras a la pestaña
  ionViewWillEnter() {
    this.checkUserAndLoad();
    
    // Recargamos la lista de usuarios para asegurar nombres frescos
    this.usuarioService.listUsuarios().subscribe(usuarios => {
      usuarios.forEach(u => {
        if (u.id) {
          this.usuariosMap[u.id] = u.displayName || u.email || 'Usuario';
        }
      });
    });

    // Si estamos en la vista de lista (no dentro de un chat), forzamos recarga de chats
    if (!this.chatId) {
      this.cargarChats();
    }
  }

  checkUserAndLoad() {
    this.myUid = this.auth.getUserId() || '';
  }

  cargarChats() {
    if (this.myUid) {
      // Al reasignar el observable, la vista se actualizará con los datos más recientes
      this.misChats$ = this.chatService.getMyChats(this.myUid);
    }
  }

  getNombreChat(chat: any): string {
    // 1. Identificar el ID del otro participante
    if (chat.participantes && Array.isArray(chat.participantes)) {
      const otroId = chat.participantes.find((id: string) => id !== this.myUid);
      
      // 2. Si tenemos su ID, buscamos su nombre real en el mapa cargado
      if (otroId && this.usuariosMap[otroId]) {
        return this.usuariosMap[otroId];
      }
      
      // 3. Fallback: Si no está en el mapa, intentamos usar el nombre guardado en el chat
      if (otroId && chat.nombres && chat.nombres[otroId]) {
        return chat.nombres[otroId];
      }
    }
    
    return 'Usuario Desconocido';
  }

  irAChat(chat: any) {
    const nombreReal = this.getNombreChat(chat);
    this.router.navigate(['/tabs/chat'], { 
      queryParams: { chatId: chat.id, nombre: nombreReal } 
    });
  }

  volverALista() {
    this.chatId = null;
    this.router.navigate(['/tabs/chat'], { queryParams: {} });
    // Al volver, nos aseguramos de recargar la lista
    this.cargarChats();
  }

  enviar() {
    if (!this.nuevoMensaje.trim() || !this.chatId) return;
    this.chatService.sendMessage(this.chatId, this.myUid, this.nuevoMensaje);
    this.nuevoMensaje = '';
  }
}