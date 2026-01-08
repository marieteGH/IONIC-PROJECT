import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ViewWillEnter, ViewDidLeave } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { addIcons } from 'ionicons';
import { send, arrowBack, personCircleOutline } from 'ionicons/icons';

// Servicios
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ChatPage implements OnInit, ViewWillEnter, ViewDidLeave, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private chatService = inject(ChatService);
  private auth = inject(AuthService);
  private usuarioService = inject(UsuarioService);

  chatId: string | null = null;
  receptorNombre: string = '';
  nuevoMensaje: string = '';
  
  // Usamos BehaviorSubject para controlar manualmente la lista de chats
  misChats$ = new BehaviorSubject<any[]>([]); 
  mensajes$: Observable<any[]> | null = null;
  
  // Variables para gestionar las suscripciones y evitar fugas de memoria
  private chatSubscription: Subscription | null = null;
  private refreshSubscription: Subscription | null = null;

  myUid: string = ''; 
  usuariosMap: Record<string, string> = {}; 

  constructor() {
    addIcons({ send, arrowBack, personCircleOutline });
  }

  ngOnInit() {
    this.checkUserAndLoad();
    
    // 1. Escuchar la navegación normal (cambios de URL)
    this.route.queryParams.subscribe(params => {
      this.chatId = params['chatId'] || null;
      this.receptorNombre = params['nombre'] || ''; 
      
      if (this.chatId) {
        // Si hay ID, cargamos los mensajes de esa conversación específica
        this.mensajes$ = this.chatService.getMessages(this.chatId);
      } else {
        // Si no hay ID, estamos en la bandeja de entrada -> Cargar todos los chats
        this.mensajes$ = null;
        this.cargarChats();
      }
    });

    // 2. Escuchar el CLICK en el Tab (desde TabsPage)
    // Esto asegura que si tocas el icono "Chat", se fuerce una recarga desde la BD
    this.refreshSubscription = this.chatService.refresh$.subscribe(() => {
      console.log('Botón Tab pulsado: Recargando chats desde la base de datos...');
      
      // Si estamos en la lista principal, recargamos.
      // Si estabas dentro de un chat, la navegación del href="/tabs/chat" te sacará,
      // y el punto 1 (queryParams) se encargará, pero esto refuerza la acción.
      if (!this.chatId) {
        this.cargarChats();
      }
    });
  }

  ionViewWillEnter() {
    this.checkUserAndLoad();
    this.cargarNombresUsuarios();
    
    // Carga inicial al entrar en la vista
    if (!this.chatId) {
      this.cargarChats();
    }
  }

  ionViewDidLeave() {
    // Al salir, cancelamos la suscripción a los chats para "apagar" la escucha
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
      this.chatSubscription = null;
    }
  }

  ngOnDestroy() {
    if (this.chatSubscription) this.chatSubscription.unsubscribe();
    if (this.refreshSubscription) this.refreshSubscription.unsubscribe();
  }

  checkUserAndLoad() {
    this.myUid = this.auth.getUserId() || '';
  }

  cargarNombresUsuarios() {
    this.usuarioService.listUsuarios().subscribe(usuarios => {
      usuarios.forEach(u => {
        if (u.id) {
          this.usuariosMap[u.id] = u.displayName || u.email || 'Usuario';
        }
      });
    });
  }

  // Lógica principal de recuperación de datos
  cargarChats() {
    if (!this.myUid) return;

    // Reiniciamos la suscripción para asegurar datos frescos
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }

    console.log('Consultando base de datos para usuario:', this.myUid);

    // Llamada al servicio que ejecuta la query "array-contains"
    this.chatSubscription = this.chatService.getMyChats(this.myUid).subscribe({
      next: (chats) => {
        console.log('Chats recuperados:', chats.length);
        this.misChats$.next(chats);
      },
      error: (err) => console.error('Error al recuperar chats:', err)
    });
  }

  getNombreChat(chat: any): string {
    if (chat.participantes && Array.isArray(chat.participantes)) {
      const otroId = chat.participantes.find((id: string) => id !== this.myUid);
      
      if (otroId && this.usuariosMap[otroId]) return this.usuariosMap[otroId];
      if (otroId && chat.nombres && chat.nombres[otroId]) return chat.nombres[otroId];
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
  }

  enviar() {
    if (!this.nuevoMensaje.trim() || !this.chatId) return;
    this.chatService.sendMessage(this.chatId, this.myUid, this.nuevoMensaje);
    this.nuevoMensaje = '';
  }
}